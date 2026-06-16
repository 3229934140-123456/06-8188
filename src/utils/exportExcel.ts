import * as XLSX from 'xlsx'
import type { DailyStat } from '@/types'

export const exportDeliveryStats = (data: DailyStat[], startDate: string, endDate: string) => {
  const wb = XLSX.utils.book_new()

  const summaryData = [
    ['配送统计报表'],
    [`统计周期: ${startDate} 至 ${endDate}`],
    [],
    ['指标', '数值'],
    ['总订单量', data.reduce((sum, d) => sum + d.orders, 0)],
    ['平均送达时间(分钟)', Math.round(data.reduce((sum, d) => sum + d.avgTime, 0) / data.length)],
    ['食品安全事件数', data.reduce((sum, d) => sum + d.incidents, 0)],
    ['日均订单量', Math.round(data.reduce((sum, d) => sum + d.orders, 0) / data.length)],
  ]

  const ws1 = XLSX.utils.aoa_to_sheet(summaryData)
  ws1['!cols'] = [{ wch: 20 }, { wch: 15 }]
  XLSX.utils.book_append_sheet(wb, ws1, '统计汇总')

  const dailyData = [
    ['日期', '订单量', '平均送达时间(分钟)', '食品安全事件数'],
    ...data.map((d) => [d.date, d.orders, d.avgTime, d.incidents]),
  ]

  const ws2 = XLSX.utils.aoa_to_sheet(dailyData)
  ws2['!cols'] = [{ wch: 15 }, { wch: 12 }, { wch: 20 }, { wch: 18 }]
  XLSX.utils.book_append_sheet(wb, ws2, '每日明细')

  XLSX.writeFile(wb, `配送统计_${startDate}_${endDate}.xlsx`)
}
