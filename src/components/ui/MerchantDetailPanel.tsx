import { X, Clock, TrendingUp, Award, MapPin, Phone, ShoppingBag } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAppStore } from '@/store/useAppStore'
import { generateSalesData, getFoodSafetyRating } from '@/data/mockData'
import { useMemo } from 'react'

export function MerchantDetailPanel() {
  const { selectedMerchantId, merchants, setShowMerchantDetail, toggleMerchantPause } = useAppStore()

  const merchant = merchants.find((m) => m.id === selectedMerchantId)

  const salesData = useMemo(() => {
    if (!merchant) return []
    return generateSalesData(merchant.id)
  }, [merchant])

  const safetyRating = useMemo(() => {
    if (!merchant) return null
    return getFoodSafetyRating(merchant.foodSafetyLevel)
  }, [merchant])

  if (!merchant) return null

  const levelStyles: Record<string, { bg: string; text: string; ring: string }> = {
    A: { bg: 'bg-green-500/20', text: 'text-green-400', ring: 'ring-green-500/50' },
    B: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', ring: 'ring-yellow-500/50' },
    C: { bg: 'bg-red-500/20', text: 'text-red-400', ring: 'ring-red-500/50' },
  }

  const style = levelStyles[merchant.foodSafetyLevel]

  return (
    <div className="absolute right-80 top-20 bottom-24 w-96 z-20">
      <div className="h-full rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-white font-bold">商家详情</h2>
          <button
            onClick={() => setShowMerchantDetail(false)}
            className="p-1 rounded hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-700/30">
            <div className="flex items-start gap-3">
              <div className={`w-14 h-14 rounded-xl ${style.bg} flex items-center justify-center text-2xl ring-2 ${style.ring}`}>
                🏪
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{merchant.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${style.bg} ${style.text}`}>
                    食品安全 {merchant.foodSafetyLevel}级
                  </span>
                  <span className="text-xs text-slate-400">评分 {safetyRating?.score}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  实时订单
                </div>
                <div className="text-2xl font-bold text-cyan-400 mt-1">
                  {merchant.realtimeOrders}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  平均出餐
                </div>
                <div className="text-2xl font-bold text-yellow-400 mt-1">
                  {merchant.avgCookTime}<span className="text-sm font-normal text-slate-400">分钟</span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{merchant.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{merchant.phone}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-slate-700/30">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-white font-medium">近24小时销售趋势</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#00d4ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-medium">食品安全评级</h3>
            </div>

            <div className={`p-4 rounded-xl ${style.bg} border ${style.ring} ring-1`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-4xl font-bold ${style.text}`}>
                    {merchant.foodSafetyLevel}
                  </div>
                  <div className="text-sm text-slate-300 mt-1">综合评级</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{safetyRating?.score}</div>
                  <div className="text-xs text-slate-400">总分 100</div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">卫生状况</span>
                  <span className="text-white font-medium">{safetyRating ? safetyRating.score - 5 : '-'}分</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">操作规范</span>
                  <span className="text-white font-medium">{safetyRating ? safetyRating.score - 8 : '-'}分</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">食材质量</span>
                  <span className="text-white font-medium">{safetyRating ? safetyRating.score - 3 : '-'}分</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="text-xs text-slate-400">
                  上次检查：{safetyRating?.lastCheck}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={() => toggleMerchantPause(merchant.id)}
            className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
              merchant.isPaused
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50'
            }`}
          >
            {merchant.isPaused ? '恢复接单' : '暂停接单'}
          </button>
        </div>
      </div>
    </div>
  )
}
