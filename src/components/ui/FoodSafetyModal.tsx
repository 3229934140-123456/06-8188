import { useState } from 'react'
import { X, AlertTriangle, Camera, Clock, CheckCircle, XCircle, Send, Video } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { IncidentStatus, IncidentLevel } from '@/types'

export function FoodSafetyModal() {
  const { showFoodSafetyModal, setShowFoodSafetyModal, incidents, resolveIncident } = useAppStore()
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [rectifyText, setRectifyText] = useState('')
  const [reviewText, setReviewText] = useState('')

  if (!showFoodSafetyModal) return null

  const levelColors: Record<IncidentLevel, { bg: string; text: string; border: string }> = {
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    serious: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
  }

  const statusLabels: Record<IncidentStatus, string> = {
    pending: '待处理',
    rectifying: '整改中',
    reviewing: '待审核',
    resolved: '已解决',
  }

  const typeLabels: Record<string, string> = {
    foreign_object: '异物检测',
    hygiene: '卫生问题',
    temperature: '温度异常',
  }

  const currentIncident = incidents.find((i) => i.id === selectedIncident) || incidents[0]

  const handleResolve = () => {
    if (currentIncident) {
      resolveIncident(currentIncident.id)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setShowFoodSafetyModal(false)}
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">食品安全监管中心</h2>
              <p className="text-slate-400 text-sm">实时监控与事件处理</p>
            </div>
          </div>
          <button
            onClick={() => setShowFoodSafetyModal(false)}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-slate-700/50 overflow-y-auto">
            <div className="p-3 space-y-2">
              {incidents.map((incident) => {
                const style = levelColors[incident.level]
                const isSelected = currentIncident?.id === incident.id
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident.id)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? `${style.bg} ${style.border} border`
                        : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <AlertTriangle className={`w-4 h-4 ${style.text} mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium text-sm ${style.text}`}>
                          {typeLabels[incident.type]}
                        </div>
                        <div className="text-white text-sm truncate">{incident.merchantName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">
                            {incident.detectedAt.split(' ')[1]}
                          </span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              incident.status === 'resolved'
                                ? 'bg-green-500/20 text-green-400'
                                : incident.status === 'reviewing'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}
                          >
                            {statusLabels[incident.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentIncident && (
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-white">{currentIncident.merchantName}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-sm font-bold ${levelColors[currentIncident.level].bg} ${levelColors[currentIncident.level].text}`}
                      >
                        {currentIncident.level === 'critical'
                          ? '严重'
                          : currentIncident.level === 'serious'
                          ? '较重'
                          : '一般'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mt-1">{typeLabels[currentIncident.type]}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-slate-400 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{currentIncident.detectedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="aspect-video rounded-xl bg-slate-800 mb-6 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="w-16 h-16 text-slate-600" />
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white text-sm font-medium">后厨监控 - 实时</span>
                  </div>
                  <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/50 rounded text-white text-xs">
                    AI检测中
                  </div>
                  {currentIncident.status !== 'resolved' && (
                    <div className="absolute inset-0 border-4 border-red-500/50 pointer-events-none">
                      <div className="absolute top-4 right-16 w-32 h-24 border-2 border-red-500 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-medium mb-2">事件描述</h4>
                  <p className="text-slate-300 text-sm bg-slate-800/50 p-4 rounded-lg">
                    {currentIncident.description}
                  </p>
                </div>

                {currentIncident.status === 'rectifying' && currentIncident.rectifyDescription && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">商家整改说明</h4>
                    <p className="text-slate-300 text-sm bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                      {currentIncident.rectifyDescription}
                    </p>
                  </div>
                )}

                {currentIncident.status === 'pending' && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">商家整改</h4>
                    <textarea
                      value={rectifyText}
                      onChange={(e) => setRectifyText(e.target.value)}
                      placeholder="请输入整改措施说明..."
                      className="w-full h-24 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                    <button className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      提交整改
                    </button>
                  </div>
                )}

                {currentIncident.status === 'reviewing' && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">平台审核</h4>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="请输入审核意见..."
                      className="w-full h-24 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={handleResolve}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-2 border border-green-500/50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        通过审核
                      </button>
                      <button className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2 border border-red-500/50">
                        <XCircle className="w-4 h-4" />
                        驳回整改
                      </button>
                    </div>
                  </div>
                )}

                {currentIncident.status === 'resolved' && currentIncident.reviewComment && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">审核意见</h4>
                    <p className="text-slate-300 text-sm bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
                      {currentIncident.reviewComment}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Camera className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-400 text-sm">已保存检测截图作为证据</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
