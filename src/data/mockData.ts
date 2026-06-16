import type {
  Merchant,
  Rider,
  Order,
  Locker,
  LockerCell,
  LockerCellStatus,
  FoodSafetyIncident,
  RestrictedArea,
  BuildingData,
  User,
  SalesDataPoint,
  FoodSafetyRating,
  DailyStat,
} from '@/types'

export const mockUsers: User[] = [
  { id: 'u1', name: '系统管理员', role: 'admin' },
  { id: 'u2', name: '王老板', role: 'merchant', merchantId: 'm5' },
  { id: 'u3', name: '张骑手', role: 'rider', riderId: 'r3' },
]

export const mockMerchants: Merchant[] = [
  {
    id: 'm1',
    name: '川香阁川菜馆',
    position: { x: -30, y: 0, z: -20 },
    realtimeOrders: 23,
    avgCookTime: 15,
    foodSafetyLevel: 'A',
    isPaused: false,
    address: '科技路128号',
    phone: '13800138001',
  },
  {
    id: 'm2',
    name: '粤味茶餐厅',
    position: { x: 25, y: 0, z: -15 },
    realtimeOrders: 18,
    avgCookTime: 12,
    foodSafetyLevel: 'A',
    isPaused: false,
    address: '人民路56号',
    phone: '13800138002',
  },
  {
    id: 'm3',
    name: '老北京炸酱面',
    position: { x: -15, y: 0, z: 25 },
    realtimeOrders: 12,
    avgCookTime: 8,
    foodSafetyLevel: 'B',
    isPaused: false,
    address: '建国路88号',
    phone: '13800138003',
  },
  {
    id: 'm4',
    name: '日式居酒屋',
    position: { x: 35, y: 0, z: 20 },
    realtimeOrders: 8,
    avgCookTime: 20,
    foodSafetyLevel: 'A',
    isPaused: false,
    address: '和平路200号',
    phone: '13800138004',
  },
  {
    id: 'm5',
    name: '意式披萨屋',
    position: { x: -40, y: 0, z: 5 },
    realtimeOrders: 15,
    avgCookTime: 18,
    foodSafetyLevel: 'B',
    isPaused: true,
    address: '中山路77号',
    phone: '13800138005',
  },
  {
    id: 'm6',
    name: '湘菜馆',
    position: { x: 10, y: 0, z: -35 },
    realtimeOrders: 20,
    avgCookTime: 14,
    foodSafetyLevel: 'A',
    isPaused: false,
    address: '解放路150号',
    phone: '13800138006',
  },
  {
    id: 'm7',
    name: '韩式烤肉',
    position: { x: 45, y: 0, z: -30 },
    realtimeOrders: 6,
    avgCookTime: 25,
    foodSafetyLevel: 'C',
    isPaused: false,
    address: '学府路66号',
    phone: '13800138007',
  },
  {
    id: 'm8',
    name: '甜品工坊',
    position: { x: -25, y: 0, z: -35 },
    realtimeOrders: 30,
    avgCookTime: 10,
    foodSafetyLevel: 'A',
    isPaused: false,
    address: '文化路30号',
    phone: '13800138008',
  },
]

export const mockRiders: Rider[] = [
  {
    id: 'r1',
    name: '李师傅',
    avatar: '🚴',
    status: 'delivering',
    position: { x: -10, y: 0, z: -5 },
    currentOrderId: 'o1',
    inRestrictedArea: false,
    phone: '13900139001',
    rating: 4.9,
    totalDeliveries: 1256,
  },
  {
    id: 'r2',
    name: '王师傅',
    avatar: '🚴',
    status: 'idle',
    position: { x: 15, y: 0, z: 10 },
    inRestrictedArea: false,
    phone: '13900139002',
    rating: 4.8,
    totalDeliveries: 987,
  },
  {
    id: 'r3',
    name: '张师傅',
    avatar: '🚴',
    status: 'delivering',
    position: { x: -20, y: 0, z: 15 },
    currentOrderId: 'o2',
    inRestrictedArea: true,
    phone: '13900139003',
    rating: 4.7,
    totalDeliveries: 1530,
  },
  {
    id: 'r4',
    name: '刘师傅',
    avatar: '🚴',
    status: 'idle',
    position: { x: 30, y: 0, z: -25 },
    inRestrictedArea: false,
    phone: '13900139004',
    rating: 4.9,
    totalDeliveries: 2100,
  },
  {
    id: 'r5',
    name: '陈师傅',
    avatar: '🚴',
    status: 'delivering',
    position: { x: -35, y: 0, z: -10 },
    currentOrderId: 'o3',
    inRestrictedArea: false,
    phone: '13900139005',
    rating: 4.6,
    totalDeliveries: 876,
  },
  {
    id: 'r6',
    name: '赵师傅',
    avatar: '🚴',
    status: 'resting',
    position: { x: 5, y: 0, z: 30 },
    inRestrictedArea: false,
    phone: '13900139006',
    rating: 4.8,
    totalDeliveries: 1120,
  },
  {
    id: 'r7',
    name: '周师傅',
    avatar: '🚴',
    status: 'delivering',
    position: { x: 20, y: 0, z: -30 },
    currentOrderId: 'o4',
    inRestrictedArea: false,
    phone: '13900139007',
    rating: 4.9,
    totalDeliveries: 1650,
  },
  {
    id: 'r8',
    name: '吴师傅',
    avatar: '🚴',
    status: 'idle',
    position: { x: -5, y: 0, z: -25 },
    inRestrictedArea: false,
    phone: '13900139008',
    rating: 4.7,
    totalDeliveries: 790,
  },
]

export const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNo: 'DD202401150001',
    merchantId: 'm1',
    merchantName: '川香阁川菜馆',
    userAddress: '阳光小区3栋501',
    userPhone: '13700137001',
    userPosition: { x: -15, y: 0, z: -35 },
    status: 'delivering',
    createdAt: '2024-01-15 12:30:00',
    estimatedTime: 35,
    riderId: 'r1',
    riderName: '李师傅',
    items: [
      { id: 'i1', name: '麻婆豆腐', quantity: 1, price: 28 },
      { id: 'i2', name: '回锅肉', quantity: 1, price: 38 },
      { id: 'i3', name: '米饭', quantity: 2, price: 3 },
    ],
    totalAmount: 72,
  },
  {
    id: 'o2',
    orderNo: 'DD202401150002',
    merchantId: 'm3',
    merchantName: '老北京炸酱面',
    userAddress: '金色家园1栋203',
    userPhone: '13700137002',
    userPosition: { x: -35, y: 0, z: 35 },
    status: 'delivering',
    createdAt: '2024-01-15 12:35:00',
    estimatedTime: 25,
    riderId: 'r3',
    riderName: '张师傅',
    items: [
      { id: 'i4', name: '炸酱面', quantity: 2, price: 22 },
    ],
    totalAmount: 44,
  },
  {
    id: 'o3',
    orderNo: 'DD202401150003',
    merchantId: 'm5',
    merchantName: '意式披萨屋',
    userAddress: '翠湖天地5栋1002',
    userPhone: '13700137003',
    userPosition: { x: -45, y: 0, z: 25 },
    status: 'delivering',
    createdAt: '2024-01-15 12:25:00',
    estimatedTime: 45,
    riderId: 'r5',
    riderName: '陈师傅',
    items: [
      { id: 'i5', name: '玛格丽特披萨', quantity: 1, price: 68 },
      { id: 'i6', name: '薯条', quantity: 1, price: 15 },
    ],
    totalAmount: 83,
  },
  {
    id: 'o4',
    orderNo: 'DD202401150004',
    merchantId: 'm6',
    merchantName: '湘菜馆',
    userAddress: '万达广场B座1508',
    userPhone: '13700137004',
    userPosition: { x: 20, y: 0, z: -25 },
    status: 'delivering',
    createdAt: '2024-01-15 12:40:00',
    estimatedTime: 30,
    riderId: 'r7',
    riderName: '周师傅',
    items: [
      { id: 'i7', name: '剁椒鱼头', quantity: 1, price: 68 },
      { id: 'i8', name: '小炒肉', quantity: 1, price: 32 },
    ],
    totalAmount: 100,
  },
  {
    id: 'o5',
    orderNo: 'DD202401150005',
    merchantId: 'm2',
    merchantName: '粤味茶餐厅',
    userAddress: '中环广场A座805',
    userPhone: '13700137005',
    userPosition: { x: 30, y: 0, z: 5 },
    status: 'pending',
    createdAt: '2024-01-15 12:45:00',
    estimatedTime: 40,
    items: [
      { id: 'i9', name: '虾饺皇', quantity: 1, price: 28 },
      { id: 'i10', name: '叉烧饭', quantity: 1, price: 32 },
    ],
    totalAmount: 60,
  },
  {
    id: 'o6',
    orderNo: 'DD202401150006',
    merchantId: 'm8',
    merchantName: '甜品工坊',
    userAddress: '湖畔花园2栋302',
    userPhone: '13700137006',
    userPosition: { x: 0, y: 0, z: 0 },
    status: 'locker',
    createdAt: '2024-01-15 11:50:00',
    estimatedTime: 20,
    items: [
      { id: 'i11', name: '提拉米苏', quantity: 1, price: 35 },
      { id: 'i12', name: '奶茶', quantity: 2, price: 18 },
    ],
    totalAmount: 71,
  },
]

export const mockLockers: Locker[] = [
  {
    id: 'l1',
    name: '阳光小区取餐柜',
    position: { x: -15, y: 0, z: -35 },
    totalCells: 20,
    availableCells: 15,
    address: '阳光小区北门',
  },
  {
    id: 'l2',
    name: '科技园区取餐柜',
    position: { x: 40, y: 0, z: 5 },
    totalCells: 30,
    availableCells: 22,
    address: '科技园A座大厅',
  },
  {
    id: 'l3',
    name: '大学城取餐柜',
    position: { x: -35, y: 0, z: 35 },
    totalCells: 25,
    availableCells: 18,
    address: '大学城食堂旁',
  },
  {
    id: 'l4',
    name: '商业中心取餐柜',
    position: { x: 0, y: 0, z: 0 },
    totalCells: 40,
    availableCells: 28,
    address: '商业中心B1层',
  },
  {
    id: 'l5',
    name: '居民区取餐柜',
    position: { x: 20, y: 0, z: 35 },
    totalCells: 20,
    availableCells: 12,
    address: '幸福里小区南门',
  },
]

const generateLockerCells = (lockerId: string, total: number, occupied: number, overtime: number): LockerCell[] => {
  const cells: LockerCell[] = []
  for (let i = 1; i <= total; i++) {
    const cellNo = `${String(i).padStart(2, '0')}`
    let status: LockerCellStatus = 'empty'
    let orderNo: string | undefined
    let storedAt: string | undefined
    let overtimeMinutes: number | undefined
    let userNotified: boolean | undefined
    let redeliveryPlan: string | undefined

    if (i <= occupied) {
      status = 'occupied'
      orderNo = `DD${lockerId}${String(i).padStart(4, '0')}`
      const now = new Date()
      const stored = new Date(now.getTime() - (15 + i * 3) * 60000)
      storedAt = stored.toISOString().replace('T', ' ').slice(0, 19)
    }
    if (i <= overtime) {
      status = 'overtime'
      overtimeMinutes = 35 + i * 5
      userNotified = true
      redeliveryPlan = `已通知用户取餐超时${35 + i * 5}分钟，生成二次配送预案：指派最近空闲骑手从取餐柜取餐后送达用户地址`
      const now = new Date()
      const stored = new Date(now.getTime() - (35 + i * 5) * 60000)
      storedAt = stored.toISOString().replace('T', ' ').slice(0, 19)
    }

    cells.push({
      id: `${lockerId}-c${i}`,
      cellNo,
      status,
      orderNo,
      storedAt,
      overtimeMinutes,
      userNotified,
      redeliveryPlan,
    })
  }
  return cells
}

export const mockLockerCells: Record<string, LockerCell[]> = {
  l1: generateLockerCells('l1', 20, 5, 2),
  l2: generateLockerCells('l2', 30, 8, 1),
  l3: generateLockerCells('l3', 25, 7, 3),
  l4: generateLockerCells('l4', 40, 12, 2),
  l5: generateLockerCells('l5', 20, 8, 1),
}

export const mockIncidents: FoodSafetyIncident[] = [
  {
    id: 'inc1',
    merchantId: 'm5',
    merchantName: '意式披萨屋',
    type: 'foreign_object',
    level: 'serious',
    detectedAt: '2024-01-15 10:30:00',
    status: 'reviewing',
    description: '后厨操作台检测到疑似毛发异物',
    rectifyDescription: '已清洁操作台并更换厨师帽，加强后厨卫生管理制度',
  },
  {
    id: 'inc2',
    merchantId: 'm7',
    merchantName: '韩式烤肉',
    type: 'hygiene',
    level: 'warning',
    detectedAt: '2024-01-15 09:15:00',
    status: 'pending',
    description: '工作人员未按规范佩戴口罩',
  },
  {
    id: 'inc3',
    merchantId: 'm3',
    merchantName: '老北京炸酱面',
    type: 'temperature',
    level: 'warning',
    detectedAt: '2024-01-15 08:45:00',
    status: 'resolved',
    description: '冷藏柜温度偏高，已调整',
    reviewComment: '整改到位，恢复正常',
  },
  {
    id: 'inc4',
    merchantId: 'm1',
    merchantName: '川香阁川菜馆',
    type: 'foreign_object',
    level: 'critical',
    detectedAt: '2024-01-14 14:20:00',
    status: 'rectifying',
    description: '食材中检测到塑料碎片',
    reviewComment: '整改措施不够彻底，需要重新整改',
  },
]

export const mockRestrictedAreas: RestrictedArea[] = [
  {
    id: 'ra1',
    name: '市中心限行区',
    center: { x: -20, y: 0, z: 20 },
    width: 20,
    depth: 20,
  },
  {
    id: 'ra2',
    name: '学校周边限行',
    center: { x: 30, y: 0, z: -25 },
    width: 15,
    depth: 15,
  },
]

const generateBuildingWindows = (width: number, height: number) => {
  const windows: { x: number; y: number; lit: boolean }[] = []
  const cols = Math.floor(width / 2)
  const rows = Math.floor(height / 3)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      windows.push({
        x: -width / 2 + 1 + i * 2,
        y: 1.5 + j * 3,
        lit: Math.random() > 0.4,
      })
    }
  }
  return windows
}

const buildingConfigs = [
  { pos: { x: -45, y: 0, z: -40 }, w: 12, d: 12, h: 25 },
  { pos: { x: -25, y: 0, z: -45 }, w: 10, d: 10, h: 35 },
  { pos: { x: -10, y: 0, z: -45 }, w: 14, d: 10, h: 20 },
  { pos: { x: 10, y: 0, z: -45 }, w: 8, d: 12, h: 45 },
  { pos: { x: 30, y: 0, z: -45 }, w: 12, d: 10, h: 30 },
  { pos: { x: 50, y: 0, z: -40 }, w: 10, d: 14, h: 28 },
  { pos: { x: -50, y: 0, z: -20 }, w: 8, d: 10, h: 40 },
  { pos: { x: -50, y: 0, z: 0 }, w: 12, d: 12, h: 18 },
  { pos: { x: -50, y: 0, z: 25 }, w: 10, d: 10, h: 32 },
  { pos: { x: -45, y: 0, z: 45 }, w: 14, d: 12, h: 22 },
  { pos: { x: -20, y: 0, z: 45 }, w: 10, d: 14, h: 38 },
  { pos: { x: 0, y: 0, z: 45 }, w: 12, d: 10, h: 25 },
  { pos: { x: 20, y: 0, z: 45 }, w: 8, d: 12, h: 42 },
  { pos: { x: 40, y: 0, z: 45 }, w: 14, d: 10, h: 16 },
  { pos: { x: 50, y: 0, z: 25 }, w: 10, d: 12, h: 35 },
  { pos: { x: 50, y: 0, z: 0 }, w: 12, d: 8, h: 28 },
  { pos: { x: 50, y: 0, z: -20 }, w: 10, d: 10, h: 20 },
  { pos: { x: -40, y: 0, z: 5 }, w: 6, d: 8, h: 15 },
  { pos: { x: -5, y: 0, z: -10 }, w: 10, d: 10, h: 50 },
  { pos: { x: 15, y: 0, z: 5 }, w: 8, d: 8, h: 55 },
]

export const mockBuildings: BuildingData[] = buildingConfigs.map((cfg, idx) => ({
  id: `b${idx + 1}`,
  position: cfg.pos,
  width: cfg.w,
  depth: cfg.d,
  height: cfg.h,
  windows: generateBuildingWindows(cfg.w, cfg.h),
}))

export const generateSalesData = (merchantId: string): SalesDataPoint[] => {
  const data: SalesDataPoint[] = []
  const seed = merchantId.charCodeAt(1)
  for (let h = 0; h < 24; h++) {
    let base = 5
    if (h >= 7 && h <= 9) base = 15
    if (h >= 11 && h <= 13) base = 30
    if (h >= 17 && h <= 19) base = 25
    if (h >= 21 && h <= 22) base = 12
    if (h < 6 || h > 23) base = 2
    const variation = Math.sin(h * 0.5 + seed) * 5
    data.push({
      hour: h,
      orders: Math.max(0, Math.floor(base + variation + (Math.random() - 0.5) * 6)),
    })
  }
  return data
}

export const getFoodSafetyRating = (level: 'A' | 'B' | 'C'): FoodSafetyRating => {
  const scores = { A: 95, B: 80, C: 65 }
  return {
    level,
    score: scores[level] + Math.floor(Math.random() * 5),
    lastCheck: '2024-01-10',
  }
}

const dateStr = (daysAgo: number) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

export const mockDailyStats: DailyStat[] = Array.from({ length: 7 }, (_, i) => {
  const day = 6 - i
  return {
    date: dateStr(day),
    orders: 800 + Math.floor(Math.random() * 400),
    avgTime: 28 + Math.floor(Math.random() * 10),
    incidents: Math.floor(Math.random() * 3),
  }
})
