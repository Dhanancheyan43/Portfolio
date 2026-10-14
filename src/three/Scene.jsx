import { Suspense, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Sparkles, AdaptiveDpr } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing'
import * as THREE from 'three'
import { makePeony } from './geometry.js'
import { Flower, DriftLeaf } from './Flower.jsx'
import { DataRain } from './DataRain.jsx'
import { CircuitRings } from './CircuitRings.jsx'
import { theme } from '../theme.js'

// [position, scale, rotation, variant, leaves]
const GARDEN = [
  [[2, 0, 0], 1.1, [1.1, 0, -0.2], 0, 5],
  [[3.6, 1.8, -1.4], 0.7, [0.9, 0, 0.5], 1, 3],
  [[0.9, -1.9, 0.4], 0.6, [1.3, 0, 0.3], 2, 4],
  [[3.7, -1.6, 0], 0.75, [1.0, 0, -0.6], 3, 4],
  [[-4.8, 2.4, -3], 0.7, [0.8, 0, 0.4], 1, 3],
  [[-5, -2.5, -2], 0.8, [1.2, 0, -0.2], 2, 4],
  [[0.6, 2.5, -2.8], 0.55, [0.7, 0, 0.1], 3, 3],
]

const MOBILE_GARDEN = [
  [[0.2, 1.5, -0.5], 0.85, [1.1, 0, -0.2], 0, 5],
  [[1.5, 2.9, -1.2], 0.7, [0.9, 0, 0.5], 1, 3],
  [[-1.5, 0.2, -0.8], 0.6, [1.2, 0, 0.3], 2, 3],
  [[1.6, -2.6, -0.5], 0.75, [1.0, 0, -0.6], 3, 3],
  [[-1.7, -3.1, -1.5], 0.7, [1.2, 0, -0.2], 1, 3],
]

const LEAVES = [
  [[-0.6, 2.4, 0.6], [0.4, 0.3, 1.2], 0.6, 0],
  [[-1.6, -2.4, 0.6], [-0.6, 0.9, -0.4], 0.7, 2],
  [[4.6, 0.3, -0.6], [0.2, -0.5, 2.2], 0.8, 1],
  [[2.2, -2.6, 1.4], [1.0, 0.2, 0.6], 0.55, 0],
]

/** Camera drifts toward the pointer for a parallax feel. */
function Rig() {
  useFrame((state, dt) => {
    const { camera, pointer } = state
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.6, 2.5, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.4, 2.5, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

function Garden() {
  const mobile = useThree((s) => s.size.width < 768)
  const peonies = useMemo(
    () => [makePeony(1), makePeony(2, { rings: 10, openness: 1.1 }), makePeony(3, { rings: 8, openness: 0.8 }), makePeony(4)],
    [],
  )
  const layout = mobile ? MOBILE_GARDEN : GARDEN
  const hero = layout[0][0]

  return (
    <>
      {layout.map(([position, scale, rotation, variant, leaves], i) => (
        <Flower
          key={i}
          seed={i + 1}
          geometry={peonies[variant]}
          position={position}
          scale={scale}
          rotation={rotation}
          leaves={leaves}
        />
      ))}
      {!mobile && LEAVES.map(([p, r, s, v], i) => <DriftLeaf key={i} position={p} rotation={r} scale={s} variant={v} />)}
      <CircuitRings position={[hero[0], hero[1], hero[2] - 0.8]} scale={mobile ? 0.8 : 1} />
    </>
  )
}

export default function Scene() {
  return (
    <Canvas
      className="scene"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={[theme.void]} />
      <fog attach="fog" args={[theme.void, 7, 18]} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 5, 4]} intensity={2.6} color="#ffdcb0" />
      <pointLight position={[1.7, 0.5, -2]} intensity={18} color={theme.emerald} distance={8} />
      <pointLight position={[-4, -2, 2]} intensity={6} color={theme.peony} distance={10} />

      <Environment resolution={256}>
        <Lightformer form="rect" intensity={2} color="#ffe2c4" position={[3, 4, 3]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.5} color={theme.emerald} position={[-4, 0, -3]} scale={[2, 6, 1]} />
        <Lightformer form="ring" intensity={0.8} color={theme.gold} position={[0, -3, 2]} scale={2} />
      </Environment>

      <Suspense fallback={null}>
        <Garden />
      </Suspense>
      <DataRain />
      <Sparkles count={70} scale={[12, 7, 6]} size={2.2} speed={0.3} color={theme.gold} opacity={0.7} />
      <Sparkles count={40} scale={[12, 7, 6]} size={1.6} speed={0.5} color={theme.emerald} opacity={0.8} />

      <Rig />
      <AdaptiveDpr pixelated />
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.55} intensity={0.9} radius={0.7} />
        <Noise opacity={0.035} />
        <Vignette offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  )
}
