import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { Rider } from '@/types'
import { useAppStore } from '@/store/useAppStore'

interface RiderMarkerProps {
  rider: Rider
}

export function RiderMarker({ rider }: RiderMarkerProps) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { selectedRiderId, setSelectedRider, updateRiderPosition } = useAppStore()

  const isSelected = selectedRiderId === rider.id

  useEffect(() => {
    if (rider.status !== 'delivering') return

    const angle = Math.random() * Math.PI * 2
    const speed = 0.02 + Math.random() * 0.02
    let t = 0

    const animate = () => {
      t += 0.016
      const radius = 3 + Math.sin(t * 0.5) * 2
      const newX = rider.position.x + Math.cos(angle + t * speed) * 0.05
      const newZ = rider.position.z + Math.sin(angle + t * speed) * 0.05
      updateRiderPosition(rider.id, { x: newX, z: newZ })
    }

    const interval = setInterval(animate, 50)
    return () => clearInterval(interval)
  }, [rider.id, rider.position.x, rider.position.z, rider.status, updateRiderPosition])

  useFrame((state) => {
    if (headRef.current) {
      headRef.current.position.y = 1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.05
    }
  })

  const statusColors: Record<string, string> = {
    idle: '#2ed573',
    delivering: '#00d4ff',
    resting: '#ffa502',
  }

  const bodyColor = rider.inRestrictedArea ? '#ff4757' : statusColors[rider.status]

  return (
    <group
      ref={groupRef}
      position={[rider.position.x, 0, rider.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedRider(rider.id)
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
      {rider.inRestrictedArea && (
        <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial color="#ff4757" transparent opacity={0.6} side={2} />
        </mesh>
      )}

      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1, 8]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={bodyColor}
          emissiveIntensity={rider.inRestrictedArea ? 0.8 : 0.3}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      <mesh ref={headRef} position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#ffd4a3" />
      </mesh>

      <mesh position={[0, 2.1, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color={bodyColor} />
      </mesh>

      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color="#ffd4a3" />
      </mesh>
      <mesh position={[0.4, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.15, 0.8, 0.15]} />
        <meshStandardMaterial color="#ffd4a3" />
      </mesh>

      <mesh position={[0, -0.2, 0.4]}>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.6} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 3, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
        </mesh>
      )}

      <Html position={[0, 3.5, 0]} center distanceFactor={12}>
        <div
          className={`whitespace-nowrap rounded-lg px-2.5 py-1.5 text-white backdrop-blur-md transition-all ${
            isSelected ? 'bg-cyan-500/30 border border-cyan-400' : 'bg-slate-900/80 border border-slate-700'
          } ${rider.inRestrictedArea ? 'border-red-500 bg-red-900/50' : ''}`}
          style={{ fontSize: '11px' }}
        >
          <div className="font-medium">{rider.name}</div>
          <div className="flex items-center gap-1 mt-0.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: statusColors[rider.status] }}
            />
            <span className="text-xs opacity-80">
              {rider.status === 'delivering' ? '配送中' : rider.status === 'idle' ? '空闲' : '休息'}
            </span>
          </div>
          {rider.inRestrictedArea && (
            <div className="text-red-400 text-xs mt-0.5 font-bold animate-pulse">
              ⚠ 限行区域
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}
