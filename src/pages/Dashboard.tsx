import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scene3D } from '@/components/3d/Scene3D'
import { TopBar } from '@/components/ui/TopBar'
import { MerchantPanel } from '@/components/ui/MerchantPanel'
import { RiderPanel } from '@/components/ui/RiderPanel'
import { MerchantDetailPanel } from '@/components/ui/MerchantDetailPanel'
import { RiderDetailPanel } from '@/components/ui/RiderDetailPanel'
import { LockerDetailPanel } from '@/components/ui/LockerDetailPanel'
import { AlertBar } from '@/components/ui/AlertBar'
import { FoodSafetyModal } from '@/components/ui/FoodSafetyModal'
import { useAppStore } from '@/store/useAppStore'
import { BarChart3, FileSpreadsheet, Shield, LayoutDashboard, Navigation, AlertTriangle, X } from 'lucide-react'
import { useState, useEffect as useEff } from 'react'
import { exportDeliveryStats } from '@/utils/exportExcel'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

export function Dashboard() {
  const navigate = useNavigate()
  const {
    isLoggedIn,
    dailyStats,
    showMerchantDetail,
    showRiderDetail,
    showLockerDetail,
    detourSuggestion,
    isDetourRoute,
    currentUser,
    checkLockerOvertime,
    switchToDetourRoute,
    switchToOriginalRoute,
  } = useAppStore()
  const [showStats, setShowStats] = useState(false)
  const [activeTab, setActiveTab] = useState<'delivery' | 'safety'>('delivery')

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login')
    }
  }, [isLoggedIn, navigate])

  useEff(() => {
    const interval = setInterval(() => {
      checkLockerOvertime()
    }, 10000)
    checkLockerOvertime()
    return () => clearInterval(interval)
  }, [checkLockerOvertime])

  const handleExport = () => {
    const startDate = dailyStats[0]?.date || ''
    const endDate = dailyStats[dailyStats.length - 1]?.date || ''
    exportDeliveryStats(dailyStats, startDate, endDate)
  }

  const totalOrders = dailyStats.reduce((sum, d) => sum + d.orders, 0)
  const avgTime = Math.round(dailyStats.reduce((sum, d) => sum + d.avgTime, 0) / dailyStats.length)
  const totalIncidents = dailyStats.reduce((sum, d) => sum + d.incidents, 0)

  return (
    <div className="h-screen w-screen bg-slate-950 overflow-hidden relative">
      <TopBar />

      <div className="absolute top-16 left-0 right-0 bottom-0">
        <Scene3D />
      </div>

      <MerchantPanel />
      <RiderPanel />
      <AlertBar />

      {showMerchantDetail && <MerchantDetailPanel />}
      {showRiderDetail && <RiderDetailPanel />}
      {showLockerDetail && <LockerDetailPanel />}

      <FoodSafetyModal />

      {detourSuggestion && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-in slide-in-from-top duration-300">
          <div className="flex items-start gap-3 px-5 py-4 rounded-xl bg-red-900/90 backdrop-blur-md border border-red-500/50 shadow-2xl max-w-lg">
            <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1">
              <h3 className="text-red-300 font-bold text-sm">限行区域预警</h3>
              <p className="text-red-200/90 text-sm mt-1">{detourSuggestion}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={switchToDetourRoute}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isDetourRoute
                      ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600/50'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  绕行方案
                </button>
                <button
                  onClick={switchToOriginalRoute}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    !isDetourRoute
                      ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                      : 'bg-slate-700/50 text-slate-300 border border-slate-600 hover:bg-slate-600/50'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5" />
                  原路线
                </button>
              </div>
            </div>
            <button
              onClick={() => useAppStore.setState({ detourSuggestion: null })}
              className="p-1 rounded hover:bg-red-800/50 transition-colors"
            >
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <button
          onClick={() => setShowStats(!showStats)}
          className="px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white hover:bg-slate-800/90 transition-all flex items-center gap-2 shadow-lg"
        >
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium">数据统计</span>
        </button>
        {(currentUser?.role === 'admin' || currentUser?.role === 'merchant') && (
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white hover:bg-slate-800/90 transition-all flex items-center gap-2 shadow-lg"
          >
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">导出Excel</span>
          </button>
        )}
        <button
          onClick={() => {
            const { setShowFoodSafetyModal } = useAppStore.getState()
            setShowFoodSafetyModal(true)
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/50 text-white hover:bg-slate-800/90 transition-all flex items-center gap-2 shadow-lg"
        >
          <Shield className="w-5 h-5 text-red-400" />
          <span className="text-sm font-medium">
            {currentUser?.role === 'merchant' ? '整改提交' : currentUser?.role === 'rider' ? '安全公告' : '食品安全'}
          </span>
        </button>
      </div>

      {showStats && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-8">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowStats(false)}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">数据统计</h2>
                  <p className="text-slate-400 text-sm">近7天配送数据</p>
                </div>
              </div>
              <button
                onClick={() => setShowStats(false)}
                className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex gap-1 px-6 pt-4">
              <button
                onClick={() => setActiveTab('delivery')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === 'delivery'
                    ? 'bg-slate-800 text-cyan-400 border-t border-x border-cyan-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                配送统计
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
                  activeTab === 'safety'
                    ? 'bg-slate-800 text-red-400 border-t border-x border-red-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                食品安全
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'delivery' ? (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">总订单量</div>
                      <div className="text-3xl font-bold text-cyan-400 mt-1">{totalOrders}</div>
                      <div className="text-xs text-green-400 mt-1">↑ 12.5% 较上周</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">平均送达时间</div>
                      <div className="text-3xl font-bold text-yellow-400 mt-1">
                        {avgTime}<span className="text-lg font-normal">分钟</span>
                      </div>
                      <div className="text-xs text-green-400 mt-1">↓ 5.2% 较上周</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">准时送达率</div>
                      <div className="text-3xl font-bold text-green-400 mt-1">96.8%</div>
                      <div className="text-xs text-green-400 mt-1">↑ 1.3% 较上周</div>
                    </div>
                  </div>

                  <div className="h-64 mb-6">
                    <h3 className="text-white font-medium mb-3">每日订单量</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="orders" fill="#00d4ff" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-64">
                    <h3 className="text-white font-medium mb-3">平均配送时间趋势</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgTime"
                          stroke="#ffa502"
                          strokeWidth={2}
                          dot={{ fill: '#ffa502', r: 4 }}
                          activeDot={{ r: 6 }}
                          name="平均时间(分钟)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">安全事件总数</div>
                      <div className="text-3xl font-bold text-red-400 mt-1">{totalIncidents}</div>
                      <div className="text-xs text-green-400 mt-1">↓ 30% 较上周</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">已解决</div>
                      <div className="text-3xl font-bold text-green-400 mt-1">{totalIncidents - 1}</div>
                      <div className="text-xs text-slate-400 mt-1">解决率 85.7%</div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <div className="text-slate-400 text-sm">A级商家</div>
                      <div className="text-3xl font-bold text-emerald-400 mt-1">5</div>
                      <div className="text-xs text-slate-400 mt-1">占比 62.5%</div>
                    </div>
                  </div>

                  <div className="h-64">
                    <h3 className="text-white font-medium mb-3">每日安全事件</h3>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickFormatter={(v) => v.slice(5)} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="incidents" fill="#ff4757" radius={[4, 4, 0, 0]} name="事件数" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-700/50 flex justify-end gap-3">
              <button
                onClick={() => setShowStats(false)}
                className="px-4 py-2 rounded-lg bg-slate-700/50 text-white hover:bg-slate-600/50 transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/50 flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                导出Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
