// Dev-only close-up of a single peony for tuning geometry: /lab.html?seed=1
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { makePeony } from './three/geometry.js'
import { petalMaterial } from './three/Flower.jsx'

const q = new URLSearchParams(location.search)
const geo = makePeony(Number(q.get('seed') || 1))
const tilt = Number(q.get('tilt') ?? 0.9)

createRoot(document.getElementById('root')).render(
  <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }}>
    <ambientLight intensity={0.4} />
    <directionalLight position={[3, 4, 4]} intensity={3} color="#ffdcb0" />
    <mesh geometry={geo} material={petalMaterial} rotation={[tilt, 0, 0]} />
  </Canvas>,
)
