import { AlertTriangle, Bell, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useState } from 'react'

export function AlertBar() {
  const { incidents, setShowFoodSafetyModal } = useAppStore()
  const [dismissed, setDismissed] = useState<string[]>([])

  const activeIncidents = incidents.filter(
    (i) => i.status !== 'resolved' && !dismissed.includes(i.id),
  )

  const levelColors: Record<string, { bg: string; text: string; border: string }> = {
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    serious: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
  }

  const typeLabels: Record<string, string> = {
    foreign_object: '异物检测',
    hygiene: '卫生问题',
    temperature: '温度异常',
  }

  if (activeIncidents.length === 0) return null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[80%] max-w-4xl">
      <div className="rounded-xl bg-slate-900/90 backdrop-blur-md border border-red-500/30 shadow-2xl overflow-hidden">
        <div className="px-4 py-2 border-b border-red-500/20 bg-red-500/10 flex items-center gap-2">
          <Bell className="w-4 h-4 text-red-400 animate-pulse" />
          <span className="text-red-400 font-bold text-sm">实时告警</span>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-red-500/30 text-red-300 text-xs font-bold">
            {activeIncidents.length} 条
          </span>
        </div>

        <div className="flex gap-3 p-3 overflow-x-auto">
          {activeIncidents.map((incident) => {
            const style = levelColors[incident.level]
            return (
              <div
                key={incident.id}
                className={`flex-shrink-0 w-72 p-3 rounded-lg ${style.bg} ${style.border} border relative`}
              >
                <button
                  onClick={() => setDismissed([...dismissed, incident.id])}
                  className="absolute top-2 right-2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-5 h-5 ${style.text} flex-shrink-0 animate-pulse`} />
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${style.text}`}>
                      {typeLabels[incident.type]}
                    </div>
                    <div className="text-white text-xs mt-0.5 font-medium">
                      {incident.merchantName}
                    </div>
                    <p className="text-slate-300 text-xs mt-1 line-clamp-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400">
                        {incident.detectedAt.split(' ')[1]}
                      </span>
                      <button
                        onClick={() => setShowFoodSafetyModal(true)}
                        className="ml-auto text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                      >
                        查看详情 →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
