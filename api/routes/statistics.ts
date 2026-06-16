import { Router, type Request, type Response } from 'express'
import { dailyStats } from '../data/mockData.js'
import * as XLSX from 'xlsx'

const router = Router()

router.get('/delivery', (req: Request, res: Response): void => {
  const { startDate, endDate } = req.query

  const totalOrders = dailyStats.reduce((sum, d) => sum + d.orders, 0)
  const avgDeliveryTime = Math.round(dailyStats.reduce((sum, d) => sum + d.avgTime, 0) / dailyStats.length)
  const foodSafetyIncidents = dailyStats.reduce((sum, d) => sum + d.incidents, 0)
  const onTimeRate = 96.8

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      avgDeliveryTime,
      onTimeRate,
      foodSafetyIncidents,
      dailyData: dailyStats,
    },
  })
})

router.get('/export', (req: Request, res: Response): void => {
  const { startDate, endDate } = req.query

  const wb = XLSX.utils.book_new()

  const summaryData = [
    ['配送统计报表'],
    [`统计周期: ${startDate || '近7天'} 至 ${endDate || '今日'}`],
    [],
    ['指标', '数值'],
    ['总订单量', dailyStats.reduce((sum, d) => sum + d.orders, 0)],
    ['平均送达时间(分钟)', Math.round(dailyStats.reduce((sum, d) => sum + d.avgTime, 0) / dailyStats.length)],
    ['食品安全事件数', dailyStats.reduce((sum, d) => sum + d.incidents, 0)],
    ['准时送达率', '96.8%'],
  ]

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(wb, ws1, '统计汇总')

  const dailyData = [
    ['日期', '订单量', '平均送达时间(分钟)', '食品安全事件数'],
    ...dailyStats.map((d) => [d.date, d.orders, d.avgTime, d.incidents]),
  ]

  const ws2 = XLSX.utils.aoa_to_sheet(dailyData)
  XLSX.utils.book_append_sheet(wb, ws2, '每日明细')

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename="配送统计_${startDate || '7天'}.xlsx"`)
  res.send(buffer)
})

export default router
