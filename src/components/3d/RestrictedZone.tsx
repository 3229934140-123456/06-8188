import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { RestrictedArea } from '@/types'

interface RestrictedZoneProps {
  area: RestrictedArea
}

export function RestrictedZone({ area }: RestrictedZoneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const edgesRef = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
    if (edgesRef.current) {
      const material = edgesRef.current.material as THREE.LineBasicMaterial
      material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
  })

  const height = 8

  return (
    <group position={[area.center.x, height / 2, area.center.z]}>
      <mesh ref={meshRef}>
        <boxGeometry args={[area.width, height, area.depth]} />
        <meshBasicMaterial
          color="#ff4757"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.BoxGeometry(area.width, height, area.depth)]} />
        <lineBasicMaterial color="#ff4757" transparent opacity={0.6} linewidth={2} />
      </lineSegments>

      <mesh position={[0, -height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[Math.min(area.width, area.depth) / 2 - 0.5, Math.min(area.width, area.depth) / 2, 32]} />
        <meshBasicMaterial color="#ff4757" transparent opacity={0.4} side={2} />
      </mesh>

      <mesh position={[0, height + 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
        <meshBasicMaterial color="#ff4757" />
      </mesh>
    </group>
  )
}
