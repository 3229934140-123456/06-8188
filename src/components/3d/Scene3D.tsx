import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { Ground } from './Ground'
import { Building } from './Building'
import { MerchantMarker } from './MerchantMarker'
import { RiderMarker } from './RiderMarker'
import { LockerMarker } from './LockerMarker'
import { DeliveryRoute } from './DeliveryRoute'
import { RestrictedZone } from './RestrictedZone'
import { useAppStore } from '@/store/useAppStore'

function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(60, 50, 60)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return null
}

function SceneContent() {
  const {
    merchants,
    riders,
    lockers,
    buildings,
    restrictedAreas,
    activeRoute,
    setSelectedMerchant,
    setSelectedRider,
    setSelectedLocker,
  } = useAppStore()

  const handleSceneClick = () => {
    setSelectedMerchant(null)
    setSelectedRider(null)
    setSelectedLocker(null)
  }

  return (
    <group onClick={handleSceneClick}>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[50, 80, 30]}
        intensity={0.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 30, 0]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[-30, 20, -20]} intensity={0.2} color="#ff6b6b" />
      <pointLight position={[30, 25, 20]} intensity={0.2} color="#2ed573" />

      <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      <Ground />

      {buildings.map((building) => (
        <Building key={building.id} data={building} />
      ))}

      {restrictedAreas.map((area) => (
        <RestrictedZone key={area.id} area={area} />
      ))}

      {activeRoute && activeRoute.length >= 2 && (
        <DeliveryRoute points={activeRoute} />
      )}

      {merchants.map((merchant) => (
        <MerchantMarker key={merchant.id} merchant={merchant} />
      ))}

      {riders.map((rider) => (
        <RiderMarker key={rider.id} rider={rider} />
      ))}

      {lockers.map((locker) => (
        <LockerMarker key={locker.id} locker={locker} />
      ))}

      <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={20}
          maxDistance={150}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 6}
        />

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </group>
  )
}

export function Scene3D() {
  return (
    <Canvas
      shadows
      camera={{ position: [60, 50, 60], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      style={{ background: 'linear-gradient(to bottom, #0a1628, #0d2137)' }}
    >
      <color attach="background" args={['#0a1628']} />
      <fog attach="fog" args={['#0a1628', 80, 180]} />
      <CameraController />
      <SceneContent />
    </Canvas>
  )
}
