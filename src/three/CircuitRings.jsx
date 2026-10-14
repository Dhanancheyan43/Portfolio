import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { theme } from '../theme.js'

const RINGS = [
  { r: 1.55, tube: 0.012, speed: 0.15, arc: Math.PI * 1.6 },
  { r: 1.72, tube: 0.006, speed: -0.25, arc: Math.PI * 0.9 },
  { r: 1.86, tube: 0.02, speed: 0.08, arc: Math.PI * 0.35 },
  { r: 2.05, tube: 0.004, speed: -0.1, arc: Math.PI * 2 },
]

/** Concentric glowing HUD arcs — the emerald "implant" from the reference art. */
export function CircuitRings(props) {
  const refs = useRef([])
  useFrame((_, dt) => {
    refs.current.forEach((m, i) => m && (m.rotation.z += dt * RINGS[i].speed))
  })
  return (
    <group {...props}>
      {RINGS.map((ring, i) => (
        <mesh key={i} ref={(m) => (refs.current[i] = m)}>
          <torusGeometry args={[ring.r, ring.tube, 8, 160, ring.arc]} />
          <meshBasicMaterial color={theme.emerald} toneMapped={false} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  )
}
