import { create } from 'zustand'
import type {
  User,
  Merchant,
  Rider,
  Order,
  Locker,
  LockerCell,
  FoodSafetyIncident,
  RestrictedArea,
  BuildingData,
  RoutePoint,
  DailyStat,
} from '@/types'
import {
  mockMerchants,
  mockRiders,
  mockOrders,
  mockLockers,
  mockLockerCells,
  mockIncidents,
  mockRestrictedAreas,
  mockBuildings,
  mockDailyStats,
  mockUsers,
} from '@/data/mockData'

function distance2D(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
}

function isPointInRestricted(px: number, pz: number, areas: RestrictedArea[]): RestrictedArea | null {
  for (const area of areas) {
    const dx = Math.abs(px - area.center.x)
    const dz = Math.abs(pz - area.center.z)
    if (dx < area.width / 2 && dz < area.depth / 2) {
      return area
    }
  }
  return null
}

function buildDetourRoute(from: RoutePoint, to: RoutePoint, area: RestrictedArea): RoutePoint[] {
  const cx = area.center.x
  const cz = area.center.z
  const halfW = area.width / 2 + 3
  const halfD = area.depth / 2 + 3

  const fromSide = from.x < cx ? 'left' : 'right'
  const toSide = to.x < cx ? 'left' : 'right'

  if (from.z < cz && to.z > cz + halfD) {
    const bypassX = fromSide === 'left' ? cx - halfW : cx + halfW
    return [
      from,
      { x: bypassX, z: from.z },
      { x: bypassX, z: cz + halfD },
      to,
    ]
  }

  if (from.z > cz && to.z < cz - halfD) {
    const bypassX = fromSide === 'left' ? cx - halfW : cx + halfW
    return [
      from,
      { x: bypassX, z: from.z },
      { x: bypassX, z: cz - halfD },
      to,
    ]
  }

  const bypassZ = from.z < cz ? cz - halfD : cz + halfD
  return [
    from,
    { x: from.x, z: bypassZ },
    { x: to.x, z: bypassZ },
    to,
  ]
}

function findNearestLocker(merchantPos: { x: number; z: number }, lockers: Locker[]): Locker {
  let nearest = lockers[0]
  let minDist = Infinity
  for (const l of lockers) {
    const d = distance2D(merchantPos, l.position)
    if (d < minDist) {
      minDist = d
      nearest = l
    }
  }
  return nearest
}

interface AppState {
  currentUser: User | null
  isLoggedIn: boolean
  merchants: Merchant[]
  riders: Rider[]
  orders: Order[]
  lockers: Locker[]
  lockerCells: Record<string, LockerCell[]>
  incidents: FoodSafetyIncident[]
  restrictedAreas: RestrictedArea[]
  buildings: BuildingData[]
  dailyStats: DailyStat[]
  selectedMerchantId: string | null
  selectedRiderId: string | null
  selectedLockerId: string | null
  activeRoute: RoutePoint[] | null
  isDetourRoute: boolean
  detourSuggestion: string | null
  currentTime: string
  showLockerDetail: boolean
  showMerchantDetail: boolean
  showRiderDetail: boolean
  showFoodSafetyModal: boolean

  login: (role: 'admin' | 'merchant' | 'rider') => void
  logout: () => void
  setSelectedMerchant: (id: string | null) => void
  setSelectedRider: (id: string | null) => void
  setSelectedLocker: (id: string | null) => void
  setActiveRoute: (route: RoutePoint[] | null) => void
  updateRiderPosition: (riderId: string, position: { x: number; z: number }) => void
  toggleMerchantPause: (merchantId: string) => void
  submitRectification: (incidentId: string, description: string) => void
  reviewIncident: (incidentId: string, approved: boolean, comment: string) => void
  setShowLockerDetail: (show: boolean) => void
  setShowMerchantDetail: (show: boolean) => void
  setShowRiderDetail: (show: boolean) => void
  setShowFoodSafetyModal: (show: boolean) => void
  updateCurrentTime: () => void
  redeliverOrder: (lockerId: string, cellId: string) => void
  checkLockerOvertime: () => void
  switchToDetourRoute: () => void
  switchToOriginalRoute: () => void
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  isLoggedIn: false,
  merchants: mockMerchants,
  riders: mockRiders,
  orders: mockOrders,
  lockers: mockLockers,
  lockerCells: mockLockerCells,
  incidents: mockIncidents,
  restrictedAreas: mockRestrictedAreas,
  buildings: mockBuildings,
  dailyStats: mockDailyStats,
  selectedMerchantId: null,
  selectedRiderId: null,
  selectedLockerId: null,
  activeRoute: null,
  isDetourRoute: false,
  detourSuggestion: null,
  currentTime: new Date().toLocaleTimeString('zh-CN'),
  showLockerDetail: false,
  showMerchantDetail: false,
  showRiderDetail: false,
  showFoodSafetyModal: false,

  login: (role) => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      set({ currentUser: user, isLoggedIn: true })
    }
  },

  logout: () => {
    set({ currentUser: null, isLoggedIn: false })
  },

  setSelectedMerchant: (id) => {
    set({ selectedMerchantId: id, showMerchantDetail: !!id })
    if (id) {
      const merchant = get().merchants.find((m) => m.id === id)
      if (!merchant) return

      const riders = get().riders
      const idleRiders = riders.filter((r) => r.status === 'idle')
      if (idleRiders.length === 0) return

      const bestRider = idleRiders.reduce((best, r) => {
        const d = distance2D(r.position, merchant.position)
        const bestD = distance2D(best.position, merchant.position)
        return d < bestD ? r : best
      })

      const nearestLocker = findNearestLocker(merchant.position, get().lockers)

      const route: RoutePoint[] = [
        { x: bestRider.position.x, z: bestRider.position.z },
        { x: merchant.position.x, z: merchant.position.z },
        { x: nearestLocker.position.x, z: nearestLocker.position.z },
      ]

      const riderArea = isPointInRestricted(bestRider.position.x, bestRider.position.z, get().restrictedAreas)
      let detourSuggestion: string | null = null
      let isDetour = false

      if (riderArea) {
        detourSuggestion = `骑手${bestRider.name}当前位于「${riderArea.name}」限行区域内，建议从${riderArea.center.x > 0 ? '西侧' : '东侧'}绕行至${merchant.name}`
        isDetour = true
      }

      const merchantArea = isPointInRestricted(merchant.position.x, merchant.position.z, get().restrictedAreas)
      if (merchantArea && !riderArea) {
        detourSuggestion = `商家${merchant.name}位于「${merchantArea.name}」限行区域边缘，建议骑手从外围道路接近`
      }

      set({ activeRoute: route, detourSuggestion, isDetourRoute: isDetour })
    }
  },

  setSelectedRider: (id) => {
    set({ selectedRiderId: id, showRiderDetail: !!id })
    if (id) {
      const rider = get().riders.find((r) => r.id === id)
      if (!rider) return

      const order = get().orders.find((o) => o.id === rider.currentOrderId)
      const merchant = get().merchants.find((m) => m.id === order?.merchantId)
      if (!merchant) return

      const nearestLocker = findNearestLocker(merchant.position, get().lockers)

      const route: RoutePoint[] = [
        { x: rider.position.x, z: rider.position.z },
        { x: merchant.position.x, z: merchant.position.z },
        { x: nearestLocker.position.x, z: nearestLocker.position.z },
      ]

      let detourSuggestion: string | null = null
      let isDetour = false

      if (rider.inRestrictedArea) {
        const area = isPointInRestricted(rider.position.x, rider.position.z, get().restrictedAreas)
        if (area) {
          detourSuggestion = `骑手${rider.name}已进入「${area.name}」限行区域！建议立即从${area.center.x > 0 ? '西侧科技路' : '东侧解放路'}绕行，避开限行区域前往${merchant.name}`
          isDetour = true
        }
      }

      set({ activeRoute: route, detourSuggestion, isDetourRoute: isDetour })
    }
  },

  setSelectedLocker: (id) => {
    set({ selectedLockerId: id, showLockerDetail: !!id })
  },

  setActiveRoute: (route) => {
    set({ activeRoute: route })
  },

  updateRiderPosition: (riderId, position) => {
    set((state) => ({
      riders: state.riders.map((r) =>
        r.id === riderId
          ? { ...r, position: { ...r.position, x: position.x, z: position.z } }
          : r,
      ),
    }))

    const rider = get().riders.find((r) => r.id === riderId)
    if (rider) {
      const area = isPointInRestricted(position.x, position.z, get().restrictedAreas)
      const inRestricted = area !== null

      if (rider.inRestrictedArea !== inRestricted) {
        set((state) => ({
          riders: state.riders.map((r) =>
            r.id === riderId ? { ...r, inRestrictedArea: inRestricted } : r,
          ),
        }))

        if (inRestricted && area) {
          const order = get().orders.find((o) => o.id === rider.currentOrderId)
          const merchant = get().merchants.find((m) => m.id === order?.merchantId)
          const merchantName = merchant?.name || '目的地'
          set({
            detourSuggestion: `⚠️ 骑手${rider.name}已进入「${area.name}」限行区域！建议立即从${area.center.x > 0 ? '西侧科技路' : '东侧解放路'}绕行，避开限行区域前往${merchantName}`,
            isDetourRoute: true,
          })
        } else {
          set({ detourSuggestion: null, isDetourRoute: false })
        }
      }
    }
  },

  toggleMerchantPause: (merchantId) => {
    set((state) => ({
      merchants: state.merchants.map((m) =>
        m.id === merchantId ? { ...m, isPaused: !m.isPaused } : m,
      ),
    }))
  },

  submitRectification: (incidentId, description) => {
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === incidentId
          ? { ...i, status: 'reviewing' as const, rectifyDescription: description }
          : i,
      ),
    }))
  },

  reviewIncident: (incidentId, approved, comment) => {
    set((state) => {
      const incident = state.incidents.find((i) => i.id === incidentId)
      if (!incident) return state

      const newStatus = approved ? 'resolved' as const : 'rectifying' as const
      const newIncidents = state.incidents.map((i) =>
        i.id === incidentId
          ? { ...i, status: newStatus, reviewComment: comment }
          : i,
      )

      const newMerchants = approved
        ? state.merchants.map((m) =>
            m.id === incident.merchantId ? { ...m, isPaused: false } : m,
          )
        : state.merchants

      return { incidents: newIncidents, merchants: newMerchants }
    })
  },

  setShowLockerDetail: (show) => {
    set({ showLockerDetail: show })
  },

  setShowMerchantDetail: (show) => {
    set({ showMerchantDetail: show })
  },

  setShowRiderDetail: (show) => {
    set({ showRiderDetail: show })
  },

  setShowFoodSafetyModal: (show) => {
    set({ showFoodSafetyModal: show })
  },

  updateCurrentTime: () => {
    set({ currentTime: new Date().toLocaleTimeString('zh-CN') })
  },

  checkLockerOvertime: () => {
    set((state) => {
      const newCells: Record<string, LockerCell[]> = {}
      const now = new Date()

      for (const [lockerId, cells] of Object.entries(state.lockerCells)) {
        newCells[lockerId] = cells.map((cell) => {
          if (cell.status === 'occupied' && cell.storedAt) {
            const storedTime = new Date(cell.storedAt.replace(' ', 'T'))
            const diffMinutes = Math.floor((now.getTime() - storedTime.getTime()) / 60000)
            if (diffMinutes >= 30) {
              return {
                ...cell,
                status: 'overtime' as const,
                overtimeMinutes: diffMinutes,
                userNotified: true,
                redeliveryPlan: `已通知用户取餐超时${diffMinutes}分钟，生成二次配送预案：指派最近空闲骑手从取餐柜取餐后送达用户地址`,
              }
            }
          }
          return cell
        })
      }

      return { lockerCells: newCells }
    })
  },

  redeliverOrder: (lockerId, cellId) => {
    const state = get()
    const cells = state.lockerCells[lockerId]
    if (!cells) return
    const cell = cells.find((c) => c.id === cellId)
    if (!cell) return

    const locker = state.lockers.find((l) => l.id === lockerId)
    if (!locker) return

    const idleRiders = state.riders.filter((r) => r.status === 'idle')
    let bestRider: Rider | null = null
    if (idleRiders.length > 0) {
      bestRider = idleRiders.reduce((best, r) => {
        const d = distance2D(r.position, locker.position)
        const bestD = distance2D(best.position, locker.position)
        return d < bestD ? r : best
      })
    }

    const userDestX = locker.position.x + 15
    const userDestZ = locker.position.z + 10

    if (bestRider) {
      const route: RoutePoint[] = [
        { x: bestRider.position.x, z: bestRider.position.z },
        { x: locker.position.x, z: locker.position.z },
        { x: userDestX, z: userDestZ },
      ]
      set({ activeRoute: route })
    }

    set((s) => ({
      lockerCells: {
        ...s.lockerCells,
        [lockerId]: s.lockerCells[lockerId].map((c) =>
          c.id === cellId
            ? {
                ...c,
                status: 'redelivering' as const,
                redeliveryRiderId: bestRider?.id,
                redeliveryPlan: `骑手${bestRider?.name || '待分配'}已接单，正在前往取餐柜取餐后二次配送`,
              }
            : c,
        ),
      },
      riders: bestRider
        ? s.riders.map((r) =>
            r.id === bestRider.id
              ? { ...r, status: 'delivering' as const }
              : r,
          )
        : s.riders,
    }))
  },

  switchToDetourRoute: () => {
    const { activeRoute, restrictedAreas, riders, selectedRiderId } = get()
    if (!activeRoute || activeRoute.length < 2) return

    const rider = riders.find((r) => r.id === selectedRiderId)
    if (!rider || !rider.inRestrictedArea) return

    const area = isPointInRestricted(rider.position.x, rider.position.z, restrictedAreas)
    if (!area) return

    const merchant = get().merchants.find((m) => m.id === get().orders.find((o) => o.id === rider.currentOrderId)?.merchantId)
    if (!merchant) return

    const detour = buildDetourRoute(
      { x: rider.position.x, z: rider.position.z },
      { x: merchant.position.x, z: merchant.position.z },
      area,
    )

    const nearestLocker = findNearestLocker(merchant.position, get().lockers)
    const fullRoute = [...detour, { x: nearestLocker.position.x, z: nearestLocker.position.z }]

    set({ activeRoute: fullRoute, isDetourRoute: true })
  },

  switchToOriginalRoute: () => {
    const { selectedRiderId, riders, merchants, orders, lockers } = get()
    const rider = riders.find((r) => r.id === selectedRiderId)
    if (!rider) return

    const order = orders.find((o) => o.id === rider.currentOrderId)
    const merchant = merchants.find((m) => m.id === order?.merchantId)
    if (!merchant) return

    const nearestLocker = findNearestLocker(merchant.position, lockers)
    const route: RoutePoint[] = [
      { x: rider.position.x, z: rider.position.z },
      { x: merchant.position.x, z: merchant.position.z },
      { x: nearestLocker.position.x, z: nearestLocker.position.z },
    ]

    set({ activeRoute: route, isDetourRoute: false, detourSuggestion: null })
  },
}))
