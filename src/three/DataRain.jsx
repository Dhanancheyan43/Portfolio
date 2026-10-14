import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { rng } from './geometry.js'
import { theme } from '../theme.js'

const vertex = /* glsl */ `
  attribute float aSeed;
  varying vec2 vUv;
  varying float vSeed;
  void main() {
    vUv = uv;
    vSeed = aSeed;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vSeed;
  void main() {
    float speed = 0.06 + vSeed * 0.12;
    float y = fract(vUv.y + uTime * speed + vSeed * 10.0);
    // A bright head with a fading tail, chopped into glyph-like cells.
    float trail = pow(y, 6.0);
    float cells = step(0.35, fract(vUv.y * (40.0 + vSeed * 30.0)));
    float flicker = 0.6 + 0.4 * sin(uTime * 3.0 + vSeed * 50.0 + floor(vUv.y * 60.0));
    float edge = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
    float a = trail * cells * flicker * edge;
    gl_FragColor = vec4(uColor * (1.0 + trail * 2.5), a * 0.85);
  }
`

/** Emerald "digital rain" streams falling behind the garden. */
export function DataRain({ count = 70 }) {
  const ref = useRef()
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(theme.emerald) } }), [])

  const { geometry, matrices } = useMemo(() => {
    const r = rng(42)
    const geo = new THREE.PlaneGeometry(0.06, 9)
    const seeds = new Float32Array(count)
    const m = []
    const o = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      seeds[i] = r()
      o.position.set((r() - 0.5) * 22, (r() - 0.5) * 4, -5 - r() * 9)
      o.scale.set(0.6 + r() * 1.4, 0.7 + r() * 0.6, 1)
      o.updateMatrix()
      m.push(o.matrix.clone())
    }
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1))
    return { geometry: geo, matrices: m }
  }, [count])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <instancedMesh
      ref={(mesh) => {
        if (!mesh || ref.current === mesh) return
        ref.current = mesh
        matrices.forEach((mat, i) => mesh.setMatrixAt(i, mat))
        mesh.instanceMatrix.needsUpdate = true
      }}
      args={[geometry, undefined, count]}
      frustumCulled={false}
    >
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </instancedMesh>
  )
}
