import { useState, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Merchant } from '@/types'
import { useAppStore } from '@/store/useAppStore'

interface MerchantMarkerProps {
  merchant: Merchant
}

export function MerchantMarker({ merchant }: MerchantMarkerProps) {
  const [hovered, setHovered] = useState(false)
  const ringRef = useRef<THREE.Mesh>(null)
  const { selectedMerchantId, setSelectedMerchant } = useAppStore()

  const isSelected = selectedMerchantId === merchant.id

  useFrame((state) => {
    if (ringRef.current && isSelected) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1
      ringRef.current.scale.set(scale, 1, scale)
    }
  })

  const levelColors: Record<string, string> = {
    A: '#2ed573',
    B: '#ffa502',
    C: '#ff4757',
  }

  const baseColor = merchant.isPaused ? '#666666' : '#00d4ff'

  return (
    <group
      position={[merchant.position.x, 0, merchant.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedMerchant(merchant.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 2, 32]} />
        <meshBasicMaterial
          color={isSelected ? '#00d4ff' : baseColor}
          transparent
          opacity={isSelected ? 0.8 : 0.4}
          side={2}
        />
      </mesh>

      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.8, 1, 3, 8]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial
          color={merchant.isPaused ? '#ff4757' : '#ffffff'}
          emissive={merchant.isPaused ? '#ff4757' : baseColor}
          emissiveIntensity={0.3}
        />
      </mesh>

      <mesh position={[0, 3.2, 0]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={0.2}
        />
      </mesh>

      <Html position={[0, 5, 0]} center distanceFactor={10}>
        <div
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-white backdrop-blur-md transition-all ${
            isSelected ? 'bg-cyan-500/30 border border-cyan-400' : 'bg-slate-900/80 border border-slate-700'
          }`}
          style={{ fontSize: '12px' }}
        >
          <div className="font-bold text-cyan-300">{merchant.name}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs">订单: {merchant.realtimeOrders}</span>
            <span className="text-xs text-yellow-300">出餐: {merchant.avgCookTime}分钟</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="rounded px-1.5 py-0.5 text-xs font-bold"
              style={{ backgroundColor: levelColors[merchant.foodSafetyLevel] + '40', color: levelColors[merchant.foodSafetyLevel] }}
            >
              {merchant.foodSafetyLevel}级
            </span>
            {merchant.isPaused && (
              <span className="text-red-400 text-xs font-bold">已暂停</span>
            )}
          </div>
        </div>
      </Html>
    </group>
  )
}
