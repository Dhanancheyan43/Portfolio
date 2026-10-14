import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { makeLeaf, rng } from './geometry.js'
import { theme } from '../theme.js'

export const petalMaterial = new THREE.MeshPhysicalMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  roughness: 0.55,
  sheen: 1,
  sheenColor: new THREE.Color(theme.peonyTip),
  sheenRoughness: 0.45,
  emissive: new THREE.Color(theme.peonyDeep),
  emissiveIntensity: 0.04,
})

export const leafMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  side: THREE.DoubleSide,
  metalness: 0.35,
  roughness: 0.32,
})

const leafGeos = [
  makeLeaf({ length: 1.1, width: 0.5, fold: 0.28, bend: 0.3 }),
  makeLeaf({ length: 0.85, width: 0.42, fold: 0.2, bend: 0.15 }),
  makeLeaf({ length: 1.3, width: 0.55, fold: 0.32, bend: 0.4 }),
]

/** A floating peony with a collar of gilded leaves. Hover to make it swell, turn and glow. */
export function Flower({ geometry, seed = 1, leaves = 4, scale = 1, rotation = [0, 0, 0], ...props }) {
  const group = useRef()
  const [hovered, setHovered] = useState(false)
  const material = useMemo(() => petalMaterial.clone(), [])

  const leafLayout = useMemo(() => {
    const r = rng(seed * 31 + 7)
    return Array.from({ length: leaves }, (_, i) => ({
      geo: leafGeos[Math.floor(r() * leafGeos.length)],
      phi: (i / leaves) * Math.PI * 2 + r() * 0.6,
      tilt: 1.15 + r() * 0.35,
      size: 0.8 + r() * 0.5,
    }))
  }, [seed, leaves])

  useFrame((state, dt) => {
    const g = group.current
    const target = hovered ? scale * 1.18 : scale
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 6, dt))
    g.rotation.y += dt * (hovered ? 0.9 : 0.08)
    material.emissiveIntensity = THREE.MathUtils.damp(material.emissiveIntensity, hovered ? 0.35 : 0.04, 5, dt)
  })

  return (
    <Float speed={1.2} rotationIntensity={0.35} floatIntensity={0.6} floatingRange={[-0.08, 0.08]}>
      <group rotation={rotation} {...props}>
        <group
          ref={group}
          scale={scale}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = ''
          }}
        >
          <mesh geometry={geometry} material={material} castShadow />
          {leafLayout.map((l, i) => (
            <group key={i} rotation={[0, l.phi, 0]}>
              <mesh
                geometry={l.geo}
                material={leafMaterial}
                position={[0, -0.22, -0.15]}
                rotation={[-l.tilt, 0, 0]}
                scale={l.size}
              />
            </group>
          ))}
        </group>
      </group>
    </Float>
  )
}

/** A lone drifting leaf. */
export function DriftLeaf({ variant = 0, ...props }) {
  return (
    <Float speed={0.8} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh geometry={leafGeos[variant % leafGeos.length]} material={leafMaterial} {...props} />
    </Float>
  )
}
