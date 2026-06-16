import { useState } from 'react'
import { X, AlertTriangle, Camera, Clock, CheckCircle, XCircle, Send, Video, Shield, Eye, FileText } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { IncidentStatus, IncidentLevel } from '@/types'

export function FoodSafetyModal() {
  const {
    showFoodSafetyModal,
    setShowFoodSafetyModal,
    incidents,
    currentUser,
    submitRectification,
    reviewIncident,
    toggleMerchantPause,
  } = useAppStore()
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null)
  const [rectifyText, setRectifyText] = useState('')
  const [reviewText, setReviewText] = useState('')

  if (!showFoodSafetyModal) return null

  const role = currentUser?.role || 'admin'

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

  const statusFlowColors: Record<IncidentStatus, string> = {
    pending: 'bg-red-500/20 text-red-400',
    rectifying: 'bg-yellow-500/20 text-yellow-400',
    reviewing: 'bg-blue-500/20 text-blue-400',
    resolved: 'bg-green-500/20 text-green-400',
  }

  const typeLabels: Record<string, string> = {
    foreign_object: '异物检测',
    hygiene: '卫生问题',
    temperature: '温度异常',
  }

  const filteredIncidents = role === 'merchant'
    ? incidents.filter((i) => i.merchantId === currentUser?.merchantId)
    : role === 'rider'
    ? incidents.filter((i) => i.status === 'resolved')
    : incidents

  const currentIncident = filteredIncidents.find((i) => i.id === selectedIncident) || filteredIncidents[0]

  const handleSubmitRectification = () => {
    if (currentIncident && rectifyText.trim()) {
      submitRectification(currentIncident.id, rectifyText.trim())
      setRectifyText('')
    }
  }

  const handleApproveReview = () => {
    if (currentIncident) {
      reviewIncident(currentIncident.id, true, reviewText.trim() || '审核通过，整改措施到位，恢复接单')
      setReviewText('')
    }
  }

  const handleRejectReview = () => {
    if (currentIncident) {
      reviewIncident(currentIncident.id, false, reviewText.trim() || '整改措施不到位，请重新整改')
      setReviewText('')
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
              <h2 className="text-white font-bold text-lg">
                {role === 'merchant' ? '食品安全整改中心' : role === 'rider' ? '食品安全公告' : '食品安全监管中心'}
              </h2>
              <p className="text-slate-400 text-sm">
                {role === 'merchant' ? '提交整改说明与审核进度' : role === 'rider' ? '查看安全事件公告' : '事件审核与商家管理'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              role === 'admin' ? 'bg-purple-500/20 text-purple-400' : role === 'merchant' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {role === 'admin' ? '管理员视图' : role === 'merchant' ? '商家视图' : '骑手视图'}
            </span>
            <button
              onClick={() => setShowFoodSafetyModal(false)}
              className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-72 border-r border-slate-700/50 overflow-y-auto">
            <div className="p-3 space-y-2">
              {filteredIncidents.map((incident) => {
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
                          <span className={`text-xs px-1.5 py-0.5 rounded ${statusFlowColors[incident.status]}`}>
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
                <div className="flex items-start justify-between mb-4">
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

                <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-slate-800/50">
                  {(['pending', 'rectifying', 'reviewing', 'resolved'] as IncidentStatus[]).map((s, idx) => (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        currentIncident.status === s
                          ? 'bg-cyan-500 text-white'
                          : (['pending', 'rectifying', 'reviewing', 'resolved'].indexOf(currentIncident.status) > idx
                            ? 'bg-green-500/30 text-green-400'
                            : 'bg-slate-700 text-slate-500')
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-xs ${
                        currentIncident.status === s ? 'text-cyan-400 font-bold' : 'text-slate-500'
                      }`}>
                        {statusLabels[s]}
                      </span>
                      {idx < 3 && <div className="w-4 h-px bg-slate-700 mx-1" />}
                    </div>
                  ))}
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

                {currentIncident.rectifyDescription && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">商家整改说明</h4>
                    <p className="text-slate-300 text-sm bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                      {currentIncident.rectifyDescription}
                    </p>
                  </div>
                )}

                {currentIncident.reviewComment && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2">审核意见</h4>
                    <p className={`text-sm p-4 rounded-lg border ${
                      currentIncident.status === 'resolved'
                        ? 'text-green-300 bg-green-500/10 border-green-500/30'
                        : 'text-orange-300 bg-orange-500/10 border-orange-500/30'
                    }`}>
                      {currentIncident.reviewComment}
                    </p>
                  </div>
                )}

                {role === 'merchant' && currentIncident.status === 'pending' && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      提交整改说明
                    </h4>
                    <textarea
                      value={rectifyText}
                      onChange={(e) => setRectifyText(e.target.value)}
                      placeholder="请详细描述已采取的整改措施..."
                      className="w-full h-24 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={handleSubmitRectification}
                      disabled={!rectifyText.trim()}
                      className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-2 border border-cyan-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      提交整改
                    </button>
                  </div>
                )}

                {role === 'merchant' && currentIncident.status === 'rectifying' && (
                  <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <p className="text-yellow-300 text-sm">审核被驳回，请重新提交整改说明</p>
                    <textarea
                      value={rectifyText}
                      onChange={(e) => setRectifyText(e.target.value)}
                      placeholder="请重新描述整改措施..."
                      className="w-full h-20 mt-3 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                    <button
                      onClick={handleSubmitRectification}
                      disabled={!rectifyText.trim()}
                      className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors flex items-center gap-2 border border-cyan-500/50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      重新提交整改
                    </button>
                  </div>
                )}

                {role === 'merchant' && currentIncident.status === 'reviewing' && (
                  <div className="mb-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-300 text-sm">整改已提交，等待平台管理员审核中...</p>
                  </div>
                )}

                {role === 'merchant' && currentIncident.status === 'resolved' && (
                  <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-green-300 text-sm">整改已通过审核，店铺已恢复接单</p>
                  </div>
                )}

                {role === 'admin' && currentIncident.status === 'pending' && (
                  <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-red-300 text-sm font-bold">事件待处理</span>
                    </div>
                    <p className="text-red-200/80 text-sm">异物检测已触发，商家已被自动暂停接单。等待商家提交整改说明。</p>
                  </div>
                )}

                {role === 'admin' && currentIncident.status === 'reviewing' && (
                  <div className="mb-6">
                    <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-400" />
                      平台审核
                    </h4>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="请输入审核意见..."
                      className="w-full h-24 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white text-sm resize-none focus:outline-none focus:border-cyan-500/50"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={handleApproveReview}
                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-2 border border-green-500/50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        通过审核，恢复接单
                      </button>
                      <button
                        onClick={handleRejectReview}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2 border border-red-500/50"
                      >
                        <XCircle className="w-4 h-4" />
                        驳回整改
                      </button>
                    </div>
                  </div>
                )}

                {role === 'admin' && currentIncident.status === 'rectifying' && (
                  <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 text-sm font-bold">整改被驳回</span>
                    </div>
                    <p className="text-yellow-200/80 text-sm">商家需要重新提交整改说明。驳回原因：{currentIncident.reviewComment || '整改措施不到位'}</p>
                  </div>
                )}

                {role === 'rider' && (
                  <div className="mb-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300 text-sm">骑手仅可查看安全公告，无法操作</span>
                    </div>
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
