import { Store, TrendingUp, AlertCircle, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'

export function MerchantPanel() {
  const { merchants, selectedMerchantId, setSelectedMerchant } = useAppStore()

  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
    B: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    C: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  }

  return (
    <div className="absolute left-4 top-20 bottom-24 w-72 z-10">
      <div className="h-full rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-700/50">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-cyan-400" />
            <h2 className="text-white font-bold">商家列表</h2>
            <span className="ml-auto text-xs text-slate-400">{merchants.length} 家</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {merchants.map((merchant) => {
            const levelStyle = levelColors[merchant.foodSafetyLevel]
            const isSelected = selectedMerchantId === merchant.id

            return (
              <div
                key={merchant.id}
                onClick={() => setSelectedMerchant(merchant.id)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-500/50'
                    : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50 hover:border-slate-600/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">{merchant.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{merchant.address}</p>
                  </div>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border} border`}
                  >
                    {merchant.foodSafetyLevel}级
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-cyan-400" />
                    <span className="text-xs text-slate-300">{merchant.realtimeOrders} 单</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs text-slate-300">{merchant.avgCookTime}分钟</span>
                  </div>
                </div>

                {merchant.isPaused && (
                  <div className="mt-2 flex items-center gap-1 text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>已暂停接单</span>
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
