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
  resolveIncident: (incidentId: string) => void
  setShowLockerDetail: (show: boolean) => void
  setShowMerchantDetail: (show: boolean) => void
  setShowRiderDetail: (show: boolean) => void
  setShowFoodSafetyModal: (show: boolean) => void
  updateCurrentTime: () => void
  redeliverOrder: (lockerId: string, cellId: string) => void
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
      const idleRider = get().riders.find((r) => r.status === 'idle')
      if (merchant && idleRider) {
        const route: RoutePoint[] = [
          { x: idleRider.position.x, z: idleRider.position.z },
          { x: merchant.position.x + (Math.random() - 0.5) * 10, z: merchant.position.z + (Math.random() - 0.5) * 10 },
          { x: merchant.position.x, z: merchant.position.z },
        ]
        set({ activeRoute: route })
      }
    }
  },

  setSelectedRider: (id) => {
    set({ selectedRiderId: id, showRiderDetail: !!id })
    if (id) {
      const rider = get().riders.find((r) => r.id === id)
      const order = get().orders.find((o) => o.id === rider?.currentOrderId)
      const merchant = get().merchants.find((m) => m.id === order?.merchantId)
      if (rider && merchant) {
        const route: RoutePoint[] = [
          { x: rider.position.x, z: rider.position.z },
          { x: (rider.position.x + merchant.position.x) / 2 + (Math.random() - 0.5) * 5, z: (rider.position.z + merchant.position.z) / 2 + (Math.random() - 0.5) * 5 },
          { x: merchant.position.x, z: merchant.position.z },
        ]
        set({ activeRoute: route })
      }
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
      let inRestricted = false
      for (const area of get().restrictedAreas) {
        const dx = Math.abs(position.x - area.center.x)
        const dz = Math.abs(position.z - area.center.z)
        if (dx < area.width / 2 && dz < area.depth / 2) {
          inRestricted = true
          break
        }
      }
      if (rider.inRestrictedArea !== inRestricted) {
        set((state) => ({
          riders: state.riders.map((r) =>
            r.id === riderId ? { ...r, inRestrictedArea: inRestricted } : r,
          ),
        }))
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

  resolveIncident: (incidentId) => {
    set((state) => ({
      incidents: state.incidents.map((i) =>
        i.id === incidentId ? { ...i, status: 'resolved' as const } : i,
      ),
    }))
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

  redeliverOrder: (lockerId, cellId) => {
    set((state) => {
      const cells = state.lockerCells[lockerId]
      if (!cells) return state
      const cell = cells.find((c) => c.id === cellId)
      if (!cell) return state

      const idleRider = state.riders.find((r) => r.status === 'idle')
      const locker = state.lockers.find((l) => l.id === lockerId)

      if (idleRider && locker) {
        const route: RoutePoint[] = [
          { x: idleRider.position.x, z: idleRider.position.z },
          { x: locker.position.x, z: locker.position.z },
          { x: locker.position.x + 15, z: locker.position.z + 10 },
        ]
        set({ activeRoute: route })
      }

      return {
        lockerCells: {
          ...state.lockerCells,
          [lockerId]: cells.map((c) =>
            c.id === cellId ? { ...c, status: 'empty' as const, orderNo: undefined, storedAt: undefined, overtimeMinutes: undefined } : c,
          ),
        },
        lockers: state.lockers.map((l) =>
          l.id === lockerId ? { ...l, availableCells: l.availableCells + 1 } : l,
        ),
      }
    })
  },
}))
