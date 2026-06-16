import { useRef, useMemo } from 'react'
import { Mesh, GridHelper } from 'three'

export function Ground() {
  const meshRef = useRef<Mesh>(null)

  const gridHelper = useMemo(() => {
    const grid = new GridHelper(200, 100, 0x1a3a5c, 0x0d2137)
    grid.position.y = 0.01
    return grid
  }, [])

  return (
    <group>
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.3}
          roughness={0.8}
        />
      </mesh>
      <primitive object={gridHelper} />
    </group>
  )
}
