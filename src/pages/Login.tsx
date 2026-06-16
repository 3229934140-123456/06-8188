import { useState, useEffect } from 'react'
import { Shield, Camera, CheckCircle, User, Store, Bike, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import type { UserRole } from '@/types'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [scanning, setScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin')
  const [scanComplete, setScanComplete] = useState(false)

  const roles: { value: UserRole; label: string; icon: JSX.Element; desc: string }[] = [
    { value: 'admin', label: '平台管理员', icon: <Shield className="w-5 h-5" />, desc: '全局调度与审核' },
    { value: 'merchant', label: '商家', icon: <Store className="w-5 h-5" />, desc: '店铺运营管理' },
    { value: 'rider', label: '骑手', icon: <Bike className="w-5 h-5" />, desc: '订单配送导航' },
  ]

  const startScan = () => {
    setScanning(true)
    setScanProgress(0)
    setScanComplete(false)
  }

  useEffect(() => {
    if (!scanning) return

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setScanning(false)
          setScanComplete(true)
          setTimeout(() => {
            login(selectedRole)
            navigate('/dashboard')
          }, 800)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(interval)
  }, [scanning, selectedRole, login, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 mb-4 shadow-lg shadow-cyan-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl font-bold text-white tracking-wider"
            style={{ fontFamily: "'Orbitron', sans-serif" }}
          >
            城市配送调度中心
          </h1>
          <p className="text-cyan-400/70 mt-2">Smart Delivery Dispatch System</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              身份验证
            </h2>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {roles.map((role) => (
                <button
                  key={role.value}
                  onClick={() => setSelectedRole(role.value)}
                  className={`p-3 rounded-xl border transition-all ${
                    selectedRole === role.value
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    {role.icon}
                    <span className="text-xs font-medium">{role.label}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="relative">
              <div
                className={`aspect-square max-w-xs mx-auto rounded-full border-4 flex items-center justify-center relative overflow-hidden ${
                  scanComplete ? 'border-green-500' : scanning ? 'border-cyan-500' : 'border-slate-700'
                }`}
              >
                <div className="absolute inset-2 rounded-full bg-slate-800/50 flex items-center justify-center">
                  {scanComplete ? (
                    <CheckCircle className="w-20 h-20 text-green-400 animate-pulse" />
                  ) : (
                    <div className="text-center">
                      <User className="w-20 h-20 text-slate-600 mx-auto" />
                      <p className="text-slate-500 text-sm mt-2">将面部对准摄像头</p>
                    </div>
                  )}
                </div>

                {scanning && (
                  <div
                    className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-lg shadow-cyan-400/50"
                    style={{
                      top: `${scanProgress}%`,
                      opacity: 0.8,
                    }}
                  />
                )}

                <div className="absolute inset-0 rounded-full">
                  <div
                    className="absolute inset-0 rounded-full border-2 border-cyan-500/50"
                    style={{
                      clipPath: `inset(${100 - scanProgress}% 0 0 0)`,
                    }}
                  />
                </div>

                <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
              </div>

              {scanning && (
                <div className="mt-4 text-center">
                  <div className="text-cyan-400 text-sm font-medium">人脸识别中...</div>
                  <div className="w-48 h-1.5 bg-slate-700 rounded-full mx-auto mt-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-100"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {scanComplete && (
                <div className="mt-4 text-center">
                  <div className="text-green-400 text-sm font-medium">验证成功！正在进入系统...</div>
                </div>
              )}
            </div>

            <button
              onClick={startScan}
              disabled={scanning || scanComplete}
              className={`w-full mt-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                scanning || scanComplete
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5'
              }`}
            >
              <Camera className="w-5 h-5" />
              {scanning ? '识别中...' : scanComplete ? '验证成功' : '开始人脸识别'}
            </button>
          </div>

          <div className="px-6 py-4 bg-slate-800/50 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>系统版本 v2.0.1</span>
              <span>安全等级: 高</span>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          登录即表示同意《服务条款》和《隐私政策》
        </p>
      </div>
    </div>
  )
}
