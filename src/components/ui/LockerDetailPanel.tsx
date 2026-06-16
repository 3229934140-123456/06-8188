import { X, MapPin, Clock, Package, AlertTriangle, RefreshCw, Bell, FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useMemo } from 'react'
import type { LockerCellStatus } from '@/types'

export function LockerDetailPanel() {
  const { selectedLockerId, lockers, lockerCells, setShowLockerDetail, redeliverOrder } = useAppStore()

  const locker = lockers.find((l) => l.id === selectedLockerId)
  const cells = lockerCells[selectedLockerId || ''] || []

  const statusConfig: Record<LockerCellStatus, { bg: string; border: string; label: string }> = {
    empty: { bg: 'bg-slate-700', border: 'border-slate-600', label: '空闲' },
    occupied: { bg: 'bg-green-500/60', border: 'border-green-500', label: '占用' },
    overtime: { bg: 'bg-yellow-500/60', border: 'border-yellow-500', label: '超时' },
    redelivering: { bg: 'bg-cyan-500/60', border: 'border-cyan-500', label: '二次配送中' },
  }

  const stats = useMemo(() => {
    const empty = cells.filter((c) => c.status === 'empty').length
    const occupied = cells.filter((c) => c.status === 'occupied').length
    const overtime = cells.filter((c) => c.status === 'overtime').length
    const redelivering = cells.filter((c) => c.status === 'redelivering').length
    return { empty, occupied, overtime, redelivering }
  }, [cells])

  if (!locker) return null

  const handleRedeliver = (cellId: string) => {
    redeliverOrder(locker.id, cellId)
  }

  return (
    <div className="absolute left-80 top-20 bottom-24 w-80 z-20">
      <div className="h-full rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-left duration-300">
        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-white font-bold">取餐柜详情</h2>
          <button
            onClick={() => setShowLockerDetail(false)}
            className="p-1 rounded hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-slate-700/30">
            <h3 className="text-white font-bold text-lg">{locker.name}</h3>
            <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              <span>{locker.address}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-4">
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-xl font-bold text-white">{locker.totalCells}</div>
                <div className="text-xs text-slate-400">总格口</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-xl font-bold text-green-400">{stats.empty}</div>
                <div className="text-xs text-slate-400">空闲</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-xl font-bold text-yellow-400">{stats.overtime}</div>
                <div className="text-xs text-slate-400">超时</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 text-center">
                <div className="text-xl font-bold text-cyan-400">{stats.redelivering}</div>
                <div className="text-xs text-slate-400">配送中</div>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-emerald-400" />
              <h3 className="text-white font-medium">格口状态</h3>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {cells.map((cell) => {
                const config = statusConfig[cell.status]
                return (
                  <div
                    key={cell.id}
                    className={`aspect-square rounded ${config.bg} ${config.border} border flex items-center justify-center text-xs font-mono text-white/80 cursor-pointer hover:scale-110 transition-transform relative group`}
                    title={`${cell.cellNo} - ${config.label}${cell.orderNo ? '\n' + cell.orderNo : ''}`}
                  >
                    {cell.cellNo}
                    {cell.status === 'overtime' && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                    {cell.status === 'redelivering' && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    )}

                    {cell.status !== 'empty' && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-800 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-600">
                        <div className="text-slate-400">订单号</div>
                        <div className="text-white font-mono">{cell.orderNo}</div>
                        {cell.overtimeMinutes && (
                          <div className="text-yellow-400 mt-1">
                            超时 {cell.overtimeMinutes} 分钟
                          </div>
                        )}
                        {cell.userNotified && (
                          <div className="text-cyan-400 mt-1">已通知用户</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {(stats.overtime > 0 || stats.redelivering > 0) && (
            <div className="p-4 border-t border-slate-700/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <h3 className="text-white font-medium">超时与二次配送</h3>
                <span className="ml-auto px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-bold">
                  {stats.overtime + stats.redelivering} 单
                </span>
              </div>

              <div className="space-y-2">
                {cells
                  .filter((c) => c.status === 'overtime' || c.status === 'redelivering')
                  .slice(0, 5)
                  .map((cell) => (
                    <div
                      key={cell.id}
                      className={`p-3 rounded-lg border ${
                        cell.status === 'redelivering'
                          ? 'bg-cyan-500/10 border-cyan-500/30'
                          : 'bg-yellow-500/10 border-yellow-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-slate-400 text-xs">格口 {cell.cellNo}</span>
                          <div className="text-white text-sm font-mono">{cell.orderNo}</div>
                        </div>
                        <div className="text-right">
                          {cell.status === 'overtime' && (
                            <>
                              <div className="text-yellow-400 font-bold text-sm">
                                {cell.overtimeMinutes}分钟
                              </div>
                              <div className="text-xs text-slate-400">已超时</div>
                            </>
                          )}
                          {cell.status === 'redelivering' && (
                            <>
                              <div className="text-cyan-400 font-bold text-sm">配送中</div>
                              <div className="text-xs text-slate-400">二次配送</div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-400">存入: {cell.storedAt?.split(' ')[1]}</span>
                      </div>
                      {cell.userNotified && (
                        <div className="flex items-center gap-2 mt-1">
                          <Bell className="w-3 h-3 text-cyan-400" />
                          <span className="text-xs text-cyan-400">已通知用户取餐超时</span>
                        </div>
                      )}
                      {cell.redeliveryPlan && (
                        <div className="flex items-start gap-2 mt-1">
                          <FileText className="w-3 h-3 text-orange-400 mt-0.5" />
                          <span className="text-xs text-orange-300">{cell.redeliveryPlan}</span>
                        </div>
                      )}
                      {cell.status === 'overtime' && (
                        <button
                          onClick={() => handleRedeliver(cell.id)}
                          className="w-full mt-2 py-1.5 rounded bg-cyan-500/20 text-cyan-400 text-xs font-medium hover:bg-cyan-500/30 transition-colors flex items-center justify-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          发起二次配送
                        </button>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <button className="w-full py-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-medium hover:bg-emerald-500/30 transition-colors border border-emerald-500/50">
            查看全部订单
          </button>
        </div>
      </div>
    </div>
  )
}
