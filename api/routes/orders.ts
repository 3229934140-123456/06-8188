import { Router, type Request, type Response } from 'express'
import { orders, riders, merchants } from '../data/mockData.js'
import type { RoutePoint } from '../../shared/types.js'

const router = Router()

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
  const { merchantId, userAddress, items } = req.body

  const merchant = merchants.find((m) => m.id === merchantId)
  if (!merchant) {
    res.status(400).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  const idleRider = riders.find((r) => r.status === 'idle')
  if (!idleRider) {
    res.status(400).json({
      success: false,
      error: '暂无可用骑手',
    })
    return
  }

  const newOrder = {
    id: `o${Date.now()}`,
    orderNo: `DD${Date.now()}`,
    merchantId,
    merchantName: merchant.name,
    userAddress,
    userPhone: req.body.userPhone || '13800138000',
    status: 'pending' as const,
    createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
    estimatedTime: 35,
    riderId: idleRider.id,
    riderName: idleRider.name,
    items,
    totalAmount: items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0),
  }

  orders.push(newOrder)

  const route: RoutePoint[] = [
    { x: idleRider.position.x, z: idleRider.position.z },
    { x: (idleRider.position.x + merchant.position.x) / 2, z: (idleRider.position.z + merchant.position.z) / 2 },
    { x: merchant.position.x, z: merchant.position.z },
  ]

  res.status(201).json({
    success: true,
    data: {
      order: newOrder,
      assignedRider: idleRider,
      route,
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
    { x: (rider.position.x + merchant.position.x) / 2, z: (rider.position.z + merchant.position.z) / 2 },
    { x: merchant.position.x, z: merchant.position.z },
  ]

  res.status(200).json({
    success: true,
    data: { route },
  })
})

export default router
