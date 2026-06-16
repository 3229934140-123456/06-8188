import { Router, type Request, type Response } from 'express'
import { mockUsers } from '../data/mockData.js'
import type { UserRole, LoginLog } from '../../shared/types.js'

const router = Router()

const loginLogs: LoginLog[] = [
  {
    id: 'log1',
    userId: 'u1',
    userName: '系统管理员',
    loginTime: '2024-01-15 08:30:00',
    ip: '192.168.1.100',
    success: true,
  },
  {
    id: 'log2',
    userId: 'u2',
    userName: '王老板',
    loginTime: '2024-01-15 09:15:00',
    ip: '192.168.1.101',
    success: true,
  },
]

router.post('/face-login', (req: Request, res: Response): void => {
  const { role } = req.body

  const user = mockUsers.find((u) => u.role === role)

  if (!user) {
    res.status(401).json({
      success: false,
      error: '人脸识别失败',
    })
    return
  }

  const log = {
    id: `log${Date.now()}`,
    userId: user.id,
    userName: user.name,
    loginTime: new Date().toISOString().replace('T', ' ').split('.')[0],
    ip: req.ip || '127.0.0.1',
    success: true,
  }
  loginLogs.unshift(log)

  res.status(200).json({
    success: true,
    data: {
      user,
      token: `token_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    },
  })
})

router.get('/login-logs', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    data: loginLogs,
  })
})

router.post('/logout', (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: '已退出登录',
  })
})

export default router
