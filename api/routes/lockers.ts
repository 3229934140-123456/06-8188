import { Router, type Request, type Response } from 'express'
import { lockers, lockerCellsData, riders } from '../data/mockData.js'

const router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: lockers,
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const locker = lockers.find((l) => l.id === id)
  const cells = lockerCellsData[id] || []

  if (!locker) {
    res.status(404).json({
      success: false,
      error: '取餐柜不存在',
    })
    return
  }

  res.status(200).json({
    success: true,
    data: { locker, cells },
  })
})

router.post('/:lockerId/cells/:cellId/redeliver', (req: Request, res: Response): void => {
  const { lockerId, cellId } = req.params
  const cells = lockerCellsData[lockerId]
  const locker = lockers.find((l) => l.id === lockerId)

  if (!cells || !locker) {
    res.status(404).json({
      success: false,
      error: '取餐柜或格口不存在',
    })
    return
  }

  const cell = cells.find((c) => c.id === cellId)
  if (!cell) {
    res.status(404).json({
      success: false,
      error: '格口不存在',
    })
    return
  }

  cell.status = 'empty'
  cell.orderNo = undefined
  cell.storedAt = undefined
  cell.overtimeMinutes = undefined

  locker.availableCells += 1

  const idleRider = riders.find((r) => r.status === 'idle')

  res.status(200).json({
    success: true,
    data: { newRider: idleRider || null },
  })
})

export default router
