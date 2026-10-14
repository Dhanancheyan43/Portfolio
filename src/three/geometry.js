import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { theme } from '../theme.js'

// Deterministic RNG so every load grows the same garden.
export function rng(seed) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

const cBase = new THREE.Color(theme.peonyDeep)
const cBody = new THREE.Color(theme.peony)
const cTip = new THREE.Color(theme.peonyTip)
const tmp = new THREE.Color()

/**
 * A single peony petal. Grows along +y, cups toward +z.
 * u ∈ [-1, 1] across the petal, v ∈ [0, 1] from base to tip.
 */
function makePetal({ length, width, cup, curl, ruffle, seed, blush }) {
  const geo = new THREE.PlaneGeometry(1, 1, 18, 14)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2
    const v = pos.getY(i) + 0.5

    // Narrow claw at the base, broad rounded blade toward the tip.
    const w = width * (0.12 + 0.88 * Math.sqrt(Math.max(0, 1 - ((v - 0.55) / 0.56) ** 2)))
    const x = u * w * 0.5
    const y = v * length * (1 - 0.22 * u ** 4 * v) // rounded tip

    let z = cup * u * u * w * 0.5 // cross-section cupping
    z += curl * v * v * length // bend inward / outward along the length
    z += ruffle * Math.sin(u * 4.5 + seed * 6.28) * v ** 2 * 0.05 * length // soft frilled edge
    z += ruffle * Math.sin(u * 8 + seed * 3.1) * v ** 3 * 0.018 * length

    pos.setXYZ(i, x, y, z)

    // Deep pink at the base → soft pink body → peach glow at the edges.
    tmp.copy(cBase).lerp(cBody, Math.min(1, v * 1.3))
    tmp.lerp(cTip, Math.min(0.85, Math.abs(u) ** 4 * v * 0.6 + v ** 5 * 0.45 * blush))
    colors.set([tmp.r, tmp.g, tmp.b], i * 3)
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}

/** A full peony bloom: tight cupped heart, frilled middle, wide open guard petals. */
export function makePeony(seed = 1, { rings = 9, openness = 1 } = {}) {
  const r = rng(seed * 9973)
  const parts = []
  const obj = new THREE.Object3D()
  obj.rotation.order = 'YXZ'

  for (let ring = 0; ring < rings; ring++) {
    const t = ring / (rings - 1)
    const count = Math.round(5 + t * 7 + r() * 2)
    const offset = r() * Math.PI * 2

    for (let k = 0; k < count; k++) {
      const length = (0.32 + t * 0.78) * (0.85 + r() * 0.3)
      const petal = makePetal({
        length,
        width: length * (1.0 + r() * 0.3),
        cup: 0.9 - t * 0.55,
        curl: 0.18 - t * (0.38 + r() * 0.15) * openness,
        ruffle: 0.5 + t * 1.1 + r() * 0.4,
        seed: r(),
        blush: 0.5 + t,
      })

      const phi = offset + (k / count) * Math.PI * 2 + (r() - 0.5) * 0.35
      const tilt = 0.2 + t ** 1.2 * 1.25 * openness + (r() - 0.5) * 0.15
      const radius = 0.05 + t * 0.16

      obj.rotation.set(-tilt, phi, (r() - 0.5) * 0.12)
      obj.position.set(-Math.sin(phi) * radius, -t * 0.18, -Math.cos(phi) * radius)
      obj.updateMatrix()
      parts.push(petal.applyMatrix4(obj.matrix))
    }
  }

  const merged = mergeGeometries(parts)
  parts.forEach((p) => p.dispose())
  return merged
}

const cLeaf = new THREE.Color(theme.moss)
const cLeafHi = new THREE.Color(theme.leaf)
const cGold = new THREE.Color(theme.gold)

/** Glossy dark leaf with a gilded rim and midrib. Grows along +y. */
export function makeLeaf({ length = 1, width = 0.45, fold = 0.25, bend = 0.25 } = {}) {
  const geo = new THREE.PlaneGeometry(1, 1, 6, 16)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)

  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i) * 2
    const v = pos.getY(i) + 0.5
    const w = width * Math.sin(Math.PI * v ** 0.8) ** 0.85
    const x = u * w * 0.5
    const y = v * length
    const z = fold * Math.abs(u) * w - bend * v * v * length

    pos.setXYZ(i, x, y, z)

    const rim = Math.max(0, (Math.abs(u) - 0.9) / 0.1)
    const rib = Math.max(0, 1 - Math.abs(u) / 0.08) * 0.35
    tmp.copy(cLeaf).lerp(cLeafHi, 0.35 + 0.4 * Math.abs(u) * (1 - v))
    tmp.lerp(cGold, Math.min(1, rim ** 1.5 + rib))
    colors.set([tmp.r, tmp.g, tmp.b], i * 3)
  }

  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  return geo
}
