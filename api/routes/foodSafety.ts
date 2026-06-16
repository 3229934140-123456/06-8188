import { Router, type Request, type Response } from 'express'
import { incidents, merchants } from '../data/mockData.js'

const router = Router()

router.get('/incidents', (req: Request, res: Response): void => {
  const { status, merchantId, level } = req.query
  let filtered = incidents

  if (status) {
    filtered = filtered.filter((i) => i.status === status)
  }
  if (merchantId) {
    filtered = filtered.filter((i) => i.merchantId === merchantId)
  }
  if (level) {
    filtered = filtered.filter((i) => i.level === level)
  }

  res.status(200).json({
    success: true,
    data: filtered,
  })
})

router.get('/incidents/:id', (req: Request, res: Response): void => {
  const { id } = req.params
  const incident = incidents.find((i) => i.id === id)

  if (!incident) {
    res.status(404).json({
      success: false,
      error: '事件不存在',
    })
    return
  }

  res.status(200).json({
    success: true,
    data: incident,
  })
})

router.get('/merchants/:id/stream', (req: Request, res: Response): void => {
  const { id } = req.params
  const merchant = merchants.find((m) => m.id === id)

  if (!merchant) {
    res.status(404).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  res.status(200).json({
    success: true,
    data: {
      streamUrl: `https://example.com/stream/${id}`,
      merchantId: id,
      merchantName: merchant.name,
    },
  })
})

router.post('/merchants/:id/pause', (req: Request, res: Response): void => {
  const { id } = req.params
  const merchant = merchants.find((m) => m.id === id)

  if (!merchant) {
    res.status(404).json({
      success: false,
      error: '商家不存在',
    })
    return
  }

  merchant.isPaused = true

  res.status(200).json({
    success: true,
    data: { isPaused: true },
  })
})

router.post('/incidents/:id/rectify', (req: Request, res: Response): void => {
  const { id } = req.params
  const { description, evidence } = req.body
  const incident = incidents.find((i) => i.id === id)

  if (!incident) {
    res.status(404).json({
      success: false,
      error: '事件不存在',
    })
    return
  }

  incident.status = 'reviewing'
  incident.rectifyDescription = description

  res.status(200).json({
    success: true,
    data: { status: 'reviewing' },
  })
})

router.post('/incidents/:id/review', (req: Request, res: Response): void => {
  const { id } = req.params
  const { approved, comment } = req.body
  const incident = incidents.find((i) => i.id === id)

  if (!incident) {
    res.status(404).json({
      success: false,
      error: '事件不存在',
    })
    return
  }

  incident.reviewComment = comment

  if (approved) {
    incident.status = 'resolved'
    const merchant = merchants.find((m) => m.id === incident.merchantId)
    if (merchant) {
      merchant.isPaused = false
    }
  } else {
    incident.status = 'rectifying'
  }

  res.status(200).json({
    success: true,
    data: { status: incident.status },
  })
})

export default router
