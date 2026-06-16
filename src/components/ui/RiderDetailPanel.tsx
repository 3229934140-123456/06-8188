import { X, Phone, Star, MapPin, AlertTriangle, Navigation, Clock, Package } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useMemo } from 'react'

export function RiderDetailPanel() {
  const { selectedRiderId, riders, orders, setShowRiderDetail } = useAppStore()

  const rider = riders.find((r) => r.id === selectedRiderId)

  const currentOrder = useMemo(() => {
    if (!rider?.currentOrderId) return null
    return orders.find((o) => o.id === rider.currentOrderId)
  }, [rider, orders])

  if (!rider) return null

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    idle: { label: '空闲中', color: 'text-green-400', bg: 'bg-green-500/20' },
    delivering: { label: '配送中', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    resting: { label: '休息中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  }

  const status = statusConfig[rider.status]

  return (
    <div className="absolute right-80 top-20 bottom-24 w-80 z-20">
      <div className="h-full rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-white font-bold">骑手详情</h2>
          <button
            onClick={() => setShowRiderDetail(false)}
            className="p-1 rounded hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-700/30">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-3xl">
                {rider.avatar}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{rider.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="text-xs text-slate-400">ID: {rider.id}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-lg font-bold text-white">{rider.totalDeliveries}</div>
                <div className="text-xs text-slate-400">总配送</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-bold text-white">{rider.rating}</span>
                </div>
                <div className="text-xs text-slate-400">评分</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-lg font-bold text-cyan-400">98%</div>
                <div className="text-xs text-slate-400">准时率</div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{rider.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>位置: ({rider.position.x.toFixed(1)}, {rider.position.z.toFixed(1)})</span>
              </div>
            </div>

            {rider.inRestrictedArea && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50">
                <div className="flex items-center gap-2 text-red-400 font-medium">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>进入限行区域</span>
                </div>
                <p className="text-sm text-red-300/70 mt-2">
                  建议绕行：向东绕行至科技路，可避开限行区域
                </p>
              </div>
            )}
          </div>

          {currentOrder && (
            <div className="p-4 border-b border-slate-700/30">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-cyan-400" />
                <h3 className="text-white font-medium">当前订单</h3>
              </div>

              <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs">订单号</span>
                  <span className="text-white text-sm font-mono">{currentOrder.orderNo}</span>
                </div>
                <div className="mt-2">
                  <div className="text-white text-sm font-medium">{currentOrder.merchantName}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{currentOrder.userAddress}</div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-1 text-yellow-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>预计 {currentOrder.estimatedTime} 分钟</span>
                  </div>
                  <span className="text-lg font-bold text-cyan-400">¥{currentOrder.totalAmount}</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-green-400">正在配送中...</span>
              </div>
            </div>
          )}

          <div className="p-4">
            <h3 className="text-white font-medium mb-3">配送统计</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">今日配送</span>
                  <span className="text-white font-medium">32 单</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-400">本周配送</span>
                  <span className="text-white font-medium">215 单</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50 flex gap-2">
          <button className="flex-1 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 font-medium hover:bg-cyan-500/30 transition-colors border border-cyan-500/50">
            联系骑手
          </button>
          <button className="flex-1 py-2 rounded-lg bg-slate-700/50 text-white font-medium hover:bg-slate-600/50 transition-colors">
            查看轨迹
          </button>
        </div>
      </div>
    </div>
  )
}
