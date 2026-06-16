import { Router, type Request, type Response } from 'express'
import { merchants, generateSalesData, getFoodSafetyRating } from '../data/mockData.js'

const router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: merchants,
  })
})

router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const merchant = merchants.find((m) => m.id === id)

  if (!merchant) {
    res.status(404).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  const salesData = generateSalesData(id)
  const rating = getFoodSafetyRating(merchant.foodSafetyLevel)

  res.status(200).json({
    success: true,
    data: {
      merchant,
      salesData,
      foodSafetyRating: rating,
    },
  })
})

router.post('/:id/pause', (req: Request, res: Response): void => {
  const { id } = req.params
  const merchant = merchants.find((m) => m.id === id)

  if (!merchant) {
    res.status(404).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  merchant.isPaused = !merchant.isPaused

  res.status(200).json({
    success: true,
    data: { isPaused: merchant.isPaused },
  })
})

export default router
