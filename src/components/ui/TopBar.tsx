import { useEffect } from 'react'
import { Clock, Users, ShoppingBag, AlertTriangle, User, LogOut, Settings } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useState } from 'react'

export function TopBar() {
  const { currentTime, updateCurrentTime, riders, orders, incidents, currentUser, logout } = useAppStore()
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentTime()
    }, 1000)
    return () => clearInterval(interval)
  }, [updateCurrentTime])

  const onlineRiders = riders.filter((r) => r.status !== 'resting').length
  const todayOrders = orders.length
  const pendingIncidents = incidents.filter((i) => i.status !== 'resolved').length

  return (
    <div className="absolute top-0 left-0 right-0 z-20 h-16 bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-md border-b border-cyan-500/20">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏙️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wider" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              城市配送调度中心
            </h1>
            <p className="text-xs text-cyan-400/70">Smart Delivery Dispatch System</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-mono text-sm">{currentTime}</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-white font-bold text-sm">{onlineRiders}</div>
                <div className="text-xs text-slate-400">在线骑手</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-white font-bold text-sm">{todayOrders}</div>
                <div className="text-xs text-slate-400">今日订单</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${pendingIncidents > 0 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
              <div>
                <div className={`font-bold text-sm ${pendingIncidents > 0 ? 'text-red-400' : 'text-white'}`}>
                  {pendingIncidents}
                </div>
                <div className="text-xs text-slate-400">安全事件</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white text-sm font-medium">{currentUser?.name || '访客'}</div>
              <div className="text-xs text-cyan-400">
                {currentUser?.role === 'admin' ? '管理员' : currentUser?.role === 'merchant' ? '商家' : '骑手'}
              </div>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-slate-800/95 border border-slate-700 backdrop-blur-md shadow-xl z-50">
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  系统设置
                </button>
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/30 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
