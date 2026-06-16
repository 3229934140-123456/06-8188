import { Router, type Request, type Response } from 'express'
import { riders, restrictedAreas } from '../data/mockData.js'

const router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: riders,
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const rider = riders.find((r) => r.id === id)

  if (!rider) {
    res.status(404).json({
      success: false,
      error: '骑手不存在',
    })
    return
  }

  res.status(200).json({
    success: true,
    data: rider,
  })
})

router.get('/:id/location', (req: Request, res: Response): void => {
  const { id } = req.params
  const rider = riders.find((r) => r.id === id)

  if (!rider) {
    res.status(404).json({
      success: false,
      error: '骑手不存在',
    })
    return
  }

  let inRestricted = false
  for (const area of restrictedAreas) {
    const dx = Math.abs(rider.position.x - area.center.x)
    const dz = Math.abs(rider.position.z - area.center.z)
    if (dx < area.width / 2 && dz < area.depth / 2) {
      inRestricted = true
      break
    }
  }
  rider.inRestrictedArea = inRestricted

  res.status(200).json({
    success: true,
    data: {
      id: rider.id,
      position: rider.position,
      status: rider.status,
      inRestrictedArea: rider.inRestrictedArea,
    },
  })
})

export default router
