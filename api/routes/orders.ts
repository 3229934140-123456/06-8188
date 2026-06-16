import { Router, type Request, type Response } from 'express'
import { orders, riders, merchants, restrictedAreas } from '../data/mockData.js'
import type { RoutePoint, Position } from '../../shared/types.js'

const router = Router()

function distance2D(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2)
}

function findNearestLocker(merchantPos: { x: number; z: number }, lockers: { position: Position; id: string }[]): { position: Position; id: string } {
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

function isPointInRestricted(px: number, pz: number, areas: { name: string; center: Position; width: number; depth: number }[]): { name: string; center: Position; width: number; depth: number } | null {
  for (const area of areas) {
    const dx = Math.abs(px - area.center.x)
    const dz = Math.abs(pz - area.center.z)
    if (dx < area.width / 2 && dz < area.depth / 2) {
      return area
    }
  }
  return null
}

router.get('/', (req: Request, res: Response): void => {
  const { status } = req.query
  let filtered = orders
  if (status) {
    filtered = orders.filter((o) => o.status === status)
  }

  res.status(200).json({
    success: true,
    data: filtered,
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const order = orders.find((o) => o.id === id)

  if (!order) {
    res.status(404).json({
      success: false,
      error: '订单不存在',
    })
    return
  }

  res.status(200).json({
    success: true,
    data: order,
  })
})

router.post('/', (req: Request, res: Response): void => {
  const { merchantId, userAddress, items, userPosition } = req.body

  const merchant = merchants.find((m) => m.id === merchantId)
  if (!merchant) {
    res.status(400).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  const idleRiders = riders.filter((r) => r.status === 'idle')
  if (idleRiders.length === 0) {
    res.status(400).json({
      success: false,
      error: '暂无可用骑手',
    })
    return
  }

  const bestRider = idleRiders.reduce((best, r) => {
    const d = distance2D(r.position, merchant.position)
    const bestD = distance2D(best.position, merchant.position)
    return d < bestD ? r : best
  })

  const riderArea = isPointInRestricted(bestRider.position.x, bestRider.position.z, restrictedAreas)
  const merchantArea = isPointInRestricted(merchant.position.x, merchant.position.z, restrictedAreas)

  const destPosition = userPosition || {
    x: merchant.position.x + (Math.random() - 0.5) * 20,
    y: 0,
    z: merchant.position.z + (Math.random() - 0.5) * 20,
  }

  const newOrder = {
    id: `o${Date.now()}`,
    orderNo: `DD${Date.now()}`,
    merchantId,
    merchantName: merchant.name,
    userAddress,
    userPhone: req.body.userPhone || '13800138000',
    userPosition: destPosition,
    status: 'pending' as const,
    createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
    estimatedTime: 35,
    riderId: bestRider.id,
    riderName: bestRider.name,
    items,
    totalAmount: items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0),
  }

  orders.push(newOrder)

  const route: RoutePoint[] = [
    { x: bestRider.position.x, z: bestRider.position.z },
    { x: merchant.position.x, z: merchant.position.z },
    { x: destPosition.x, z: destPosition.z },
  ]

  let detourSuggestion: string | null = null

  if (riderArea) {
    detourSuggestion = `骑手${bestRider.name}当前位于「${riderArea.name}」限行区域内，建议从${riderArea.center.x > 0 ? '西侧科技路' : '东侧解放路'}绕行至${merchant.name}`
  } else if (merchantArea) {
    detourSuggestion = `商家${merchant.name}位于「${merchantArea.name}」限行区域边缘，建议骑手从外围道路接近`
  }

  res.status(201).json({
    success: true,
    data: {
      order: newOrder,
      assignedRider: bestRider,
      route,
      routeDescription: `骑手→商家→用户 三段路线已生成`,
      detourSuggestion,
      riderDistance: Math.round(distance2D(bestRider.position, merchant.position)),
    },
  })
})

router.post('/:id/assign-rider', (req: Request, res: Response): void => {
  const { id } = req.params
  const { riderId } = req.body

  const order = orders.find((o) => o.id === id)
  const rider = riders.find((r) => r.id === riderId)
  const merchant = merchants.find((m) => m.id === order?.merchantId)

  if (!order || !rider || !merchant) {
    res.status(400).json({
      success: false,
      error: '订单或骑手不存在',
    })
    return
  }

  order.riderId = riderId
  order.riderName = rider.name
  order.status = 'picking'

  const route: RoutePoint[] = [
    { x: rider.position.x, z: rider.position.z },
    { x: merchant.position.x, z: merchant.position.z },
    { x: order.userPosition.x, z: order.userPosition.z },
  ]

  res.status(200).json({
    success: true,
    data: { route },
  })
})

export default router
