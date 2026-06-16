import { useMemo } from 'react'
import type { BuildingData } from '@/types'

interface BuildingProps {
  data: BuildingData
}

export function Building({ data }: BuildingProps) {
  const { position, width, depth, height } = data

  const windows = useMemo(() => {
    const result: JSX.Element[] = []
    const cols = Math.floor(width / 2.5)
    const rows = Math.floor(height / 3.5)

    for (let side = 0; side < 2; side++) {
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = -width / 2 + 1.25 + i * 2.5
          const y = 1.75 + j * 3.5
          const z = side === 0 ? depth / 2 + 0.01 : -(depth / 2 + 0.01)
          const isLit = (i + j + side) % 3 !== 0

          result.push(
            <mesh key={`w-${side}-${i}-${j}`} position={[x, y, z]}>
              <planeGeometry args={[1.2, 2]} />
              <meshBasicMaterial
                color={isLit ? '#ffd700' : '#1a2744'}
                transparent
                opacity={isLit ? 0.9 : 0.5}
              />
            </mesh>,
          )
        }
      }
    }

    for (let side = 0; side < 2; side++) {
      const actualCols = Math.floor(depth / 2.5)
      const rows = Math.floor(height / 3.5)
      for (let i = 0; i < actualCols; i++) {
        for (let j = 0; j < rows; j++) {
          const z = -depth / 2 + 1.25 + i * 2.5
          const y = 1.75 + j * 3.5
          const x = side === 0 ? width / 2 + 0.01 : -(width / 2 + 0.01)
          const isLit = (i + j + side + 1) % 3 !== 0

          result.push(
            <mesh key={`w-side-${side}-${i}-${j}`} position={[x, y, z]} rotation={[0, Math.PI / 2, 0]}>
              <planeGeometry args={[1.2, 2]} />
              <meshBasicMaterial
                color={isLit ? '#ffd700' : '#1a2744'}
                transparent
                opacity={isLit ? 0.9 : 0.5}
              />
            </mesh>,
          )
        }
      }
    }

    return result
  }, [width, depth, height])

  return (
    <group position={[position.x, height / 2, position.z]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#16294a"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, height / 2 + 0.05, 0]}>
        <boxGeometry args={[width + 0.4, 0.3, depth + 0.4]} />
        <meshStandardMaterial
          color="#0f1f38"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>

      <group>{windows}</group>
    </group>
  )
}
