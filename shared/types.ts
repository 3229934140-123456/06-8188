export type UserRole = 'admin' | 'merchant' | 'rider'

export interface User {
  id: string
  name: string
  role: UserRole
  avatar?: string
}

export interface LoginLog {
  id: string
  userId: string
  userName: string
  loginTime: string
  ip: string
  success: boolean
}

export interface Position {
  x: number
  y: number
  z: number
}

export interface Merchant {
  id: string
  name: string
  position: Position
  realtimeOrders: number
  avgCookTime: number
  foodSafetyLevel: 'A' | 'B' | 'C'
  isPaused: boolean
  address: string
  phone: string
}

export interface SalesDataPoint {
  hour: number
  orders: number
}

export interface FoodSafetyRating {
  level: 'A' | 'B' | 'C'
  score: number
  lastCheck: string
}

export type RiderStatus = 'idle' | 'delivering' | 'resting'

export interface Rider {
  id: string
  name: string
  avatar: string
  status: RiderStatus
  position: Position
  currentOrderId?: string
  inRestrictedArea: boolean
  phone: string
  rating: number
  totalDeliveries: number
}

export interface RoutePoint {
  x: number
  z: number
}

export type OrderStatus = 'pending' | 'cooking' | 'picking' | 'delivering' | 'delivered' | 'locker'

export interface Order {
  id: string
  orderNo: string
  merchantId: string
  merchantName: string
  userAddress: string
  userPhone: string
  status: OrderStatus
  createdAt: string
  estimatedTime: number
  riderId?: string
  riderName?: string
  items: OrderItem[]
  totalAmount: number
}

export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Locker {
  id: string
  name: string
  position: Position
  totalCells: number
  availableCells: number
  address: string
}

export type LockerCellStatus = 'empty' | 'occupied' | 'overtime'

export interface LockerCell {
  id: string
  cellNo: string
  status: LockerCellStatus
  orderNo?: string
  storedAt?: string
  overtimeMinutes?: number
}

export type IncidentType = 'foreign_object' | 'hygiene' | 'temperature'
export type IncidentLevel = 'warning' | 'serious' | 'critical'
export type IncidentStatus = 'pending' | 'rectifying' | 'reviewing' | 'resolved'

export interface FoodSafetyIncident {
  id: string
  merchantId: string
  merchantName: string
  type: IncidentType
  level: IncidentLevel
  detectedAt: string
  status: IncidentStatus
  description: string
  imageUrl?: string
  rectifyDescription?: string
  reviewComment?: string
}

export interface DailyStat {
  date: string
  orders: number
  avgTime: number
  incidents: number
}

export interface RestrictedArea {
  id: string
  name: string
  center: Position
  width: number
  depth: number
}
