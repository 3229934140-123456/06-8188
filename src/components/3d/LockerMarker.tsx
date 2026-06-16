import { useState, useMemo } from 'react'
import { Html } from '@react-three/drei'
import type { Locker } from '@/types'
import { useAppStore } from '@/store/useAppStore'

interface LockerMarkerProps {
  locker: Locker
}

export function LockerMarker({ locker }: LockerMarkerProps) {
  const [hovered, setHovered] = useState(false)
  const { selectedLockerId, setSelectedLocker } = useAppStore()

  const isSelected = selectedLockerId === locker.id
  const occupancyRate = 1 - locker.availableCells / locker.totalCells

  const cells = useMemo(() => {
    const result: JSX.Element[] = []
    const cols = 4
    const rows = Math.ceil(locker.totalCells / cols)
    const cellW = 0.8
    const cellH = 0.6
    const gap = 0.15

    const totalW = cols * cellW + (cols - 1) * gap
    const totalH = rows * cellH + (rows - 1) * gap

    for (let i = 0; i < locker.totalCells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = -totalW / 2 + cellW / 2 + col * (cellW + gap)
      const y = totalH / 2 - cellH / 2 - row * (cellH + gap)
      const isOccupied = i < locker.totalCells - locker.availableCells
      const isOvertime = isOccupied && i < 2

      result.push(
        <mesh key={i} position={[x, y, 0.06]}>
          <planeGeometry args={[cellW - 0.05, cellH - 0.05]} />
          <meshBasicMaterial
            color={isOvertime ? '#ffa502' : isOccupied ? '#2ed573' : '#1a2744'}
            transparent
            opacity={isOccupied ? 0.9 : 0.5}
          />
        </mesh>,
      )
    }
    return result
  }, [locker.totalCells, locker.availableCells])

  return (
    <group
      position={[locker.position.x, 0, locker.position.z]}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedLocker(locker.id)
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
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.5} roughness={0.5} />
      </mesh>

      <group position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[3.5, 2.8, 1.5]} />
          <meshStandardMaterial
            color="#2d4a6f"
            metalness={0.6}
            roughness={0.4}
            emissive={isSelected || hovered ? '#00d4ff' : '#000000'}
            emissiveIntensity={isSelected || hovered ? 0.1 : 0}
          />
        </mesh>

        <group position={[0, 0, 0.76]}>{cells}</group>

        <mesh position={[0, 1.55, 0.01]}>
          <boxGeometry args={[3.6, 0.3, 1.52]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} />
        </mesh>

        <mesh position={[0, -1.55, 0.01]}>
          <boxGeometry args={[3.6, 0.3, 1.52]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.3} />
        </mesh>
      </group>

      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.8, 32]} />
        <meshBasicMaterial
          color="#2ed573"
          transparent
          opacity={isSelected ? 0.8 : 0.3}
          side={2}
        />
      </mesh>

      <Html position={[0, 4, 0]} center distanceFactor={10}>
        <div
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-white backdrop-blur-md transition-all ${
            isSelected ? 'bg-emerald-500/30 border border-emerald-400' : 'bg-slate-900/80 border border-slate-700'
          }`}
          style={{ fontSize: '12px' }}
        >
          <div className="font-bold text-emerald-300">{locker.name}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs">
              {locker.availableCells}/{locker.totalCells} 空闲
            </span>
            <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${occupancyRate * 100}%`,
                  backgroundColor: occupancyRate > 0.8 ? '#ff4757' : occupancyRate > 0.5 ? '#ffa502' : '#2ed573',
                }}
              />
            </div>
          </div>
        </div>
      </Html>
    </group>
  )
}
