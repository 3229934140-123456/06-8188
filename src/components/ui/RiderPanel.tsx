import { Bike, Navigation, Star, AlertTriangle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function RiderPanel() {
  const { riders, selectedRiderId, setSelectedRider } = useAppStore()

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    idle: { label: '空闲', color: 'text-green-400', bg: 'bg-green-500/20' },
    delivering: { label: '配送中', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    resting: { label: '休息', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  }

  return (
    <div className="absolute right-4 top-20 bottom-24 w-72 z-10">
      <div className="h-full rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold">骑手状态</h2>
            <span className="ml-auto text-xs text-slate-400">{riders.length} 人</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {riders.map((rider) => {
            const status = statusConfig[rider.status]
            const isSelected = selectedRiderId === rider.id

            return (
              <div
                key={rider.id}
                onClick={() => setSelectedRider(rider.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-500/50'
                    : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-xl">
                    {rider.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-medium text-sm">{rider.name}</h3>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${status.bg} ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-3 h-3 text-yellow-400" />
                      <span className="text-xs text-slate-400">{rider.rating}</span>
                      <span className="text-xs text-slate-500">|</span>
                      <span className="text-xs text-slate-400">{rider.totalDeliveries}单</span>
                    </div>
                  </div>
                </div>

                {rider.inRestrictedArea && (
                  <div className="mt-2 flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/20 border border-red-500/30">
                    <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                    <span className="text-xs text-red-400 font-medium">进入限行区域</span>
                  </div>
                )}

                {rider.status === 'delivering' && (
                  <div className="mt-2 flex items-center gap-1.5 text-cyan-400 text-xs">
                    <Navigation className="w-3 h-3" />
                    <span>配送中 - 订单 {rider.currentOrderId?.slice(-6)}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
