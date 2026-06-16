import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { RoutePoint } from '@/types'

interface DeliveryRouteProps {
  points: RoutePoint[]
  color?: string
}

export function DeliveryRoute({ points, color = '#00d4ff' }: DeliveryRouteProps) {
  const lineRef = useRef<any>(null)

  const linePoints = useMemo(() => {
    return points.map((p) => [p.x, 0.2, p.z] as [number, number, number])
  }, [points])

  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2
    }
  })

  if (points.length < 2) return null

  return (
    <group>
      <Line
        ref={lineRef}
        points={linePoints}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.8}
      />

      <Line
        points={linePoints}
        color={color}
        lineWidth={6}
        transparent
        opacity={0.2}
      />

      {points.map((point, idx) => (
        <mesh key={idx} position={[point.x, 0.3, point.z]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}
