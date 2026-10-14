import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { heartGeometry } from './heart';

type CupidProps = {
  radiusX: number;
  radiusZ: number;
  center: [number, number, number];
  speed: number;
  phase: number;
  scale?: number;
  onShoot: (position: THREE.Vector3) => void;
};

const BOW_RADIUS = 0.42;
const BOW_ARC = Math.PI * 0.85;
const STRING_X = BOW_RADIUS * Math.cos(BOW_ARC / 2);
const ARROW_END = BOW_RADIUS + 0.28;

const CURLS: [number, number, number][] = [
  ...Array.from({ length: 11 }, (_, k) => {
    const phi = (k / 11) * Math.PI * 2;
    return [Math.cos(phi) * 0.29, 0.92, Math.sin(phi) * 0.27] as [number, number, number];
  }),
  ...Array.from({ length: 5 }, (_, k) => {
    const phi = (k / 5) * Math.PI * 2;
    return [Math.cos(phi) * 0.14, 1.04, Math.sin(phi) * 0.14] as [number, number, number];
  }),
];

function Wing({ side, materials }: { side: 1 | -1; materials: { wing: THREE.Material } }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(() => Math.random() * 10, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 11 + offset;
    ref.current.rotation.y = side * (0.55 + Math.sin(t) * 0.55);
    ref.current.rotation.z = side * Math.sin(t) * 0.12;
  });

  const feathers = [0, 1, 2, 3, 4].map((j) => {
    const ang = THREE.MathUtils.degToRad(12 + j * 19);
    const len = 0.62 - j * 0.07;
    const dir = new THREE.Vector3(Math.cos(ang) * side, Math.sin(ang), -0.12);
    return {
      position: dir.clone().multiplyScalar(len * 0.92).toArray() as [number, number, number],
      rotationZ: side > 0 ? ang : Math.PI - ang,
      len,
    };
  });

  return (
    <group ref={ref} position={[side * 0.1, 0.32, -0.3]}>
      {feathers.map((f, i) => (
        <mesh key={i} position={f.position} rotation={[0, 0, f.rotationZ]} scale={[f.len, 0.13, 0.035]} material={materials.wing}>
          <sphereGeometry args={[1, 20, 12]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Cupid({ radiusX, radiusZ, center, speed, phase, scale = 1, onShoot }: CupidProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const materials = useMemo(
    () => ({
      marble: new THREE.MeshStandardMaterial({ color: '#F6F1E8', roughness: 0.45, metalness: 0.02 }),
      wing: new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.6, emissive: '#A8F5CF', emissiveIntensity: 0.08 }),
      gold: new THREE.MeshStandardMaterial({ color: '#D8B868', roughness: 0.25, metalness: 0.85 }),
      neon: new THREE.MeshBasicMaterial({ color: '#3DFF9A' }),
      rose: new THREE.MeshStandardMaterial({ color: '#F6A5BC', roughness: 0.5, transparent: true, opacity: 0.55 }),
      heart: new THREE.MeshStandardMaterial({ color: '#FF6F96', emissive: '#FF3D7A', emissiveIntensity: 0.6 }),
    }),
    [],
  );

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    const a = clock.elapsedTime * speed + phase;
    g.position.set(
      center[0] + Math.cos(a) * radiusX,
      center[1] + Math.sin(a * 2) * 0.35,
      center[2] + Math.sin(a) * radiusZ,
    );
    // Face the direction of travel along the ellipse, banking into the turn.
    const vx = -Math.sin(a) * radiusX * speed;
    const vz = Math.cos(a) * radiusZ * speed;
    g.rotation.y = Math.atan2(vx, vz);
    g.rotation.z = Math.sin(a) * 0.15;

    const target = hovered ? scale * 1.3 : scale;
    const s = THREE.MathUtils.damp(g.scale.x, target, 8, dt);
    g.scale.setScalar(s);

    const glow = THREE.MathUtils.damp(materials.marble.emissiveIntensity, hovered ? 0.5 : 0, 8, dt);
    materials.marble.emissive.set('#3DFF9A');
    materials.marble.emissiveIntensity = glow;
    materials.wing.emissiveIntensity = 0.08 + glow;
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (group.current) onShoot(group.current.getWorldPosition(new THREE.Vector3()));
  };

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = '';
      }}
      onClick={handleClick}
    >
      {/* Body and head */}
      <mesh scale={[1, 1.12, 0.9]} material={materials.marble}>
        <sphereGeometry args={[0.42, 32, 32]} />
      </mesh>
      <mesh position={[0, 0.72, 0.02]} material={materials.marble}>
        <sphereGeometry args={[0.36, 32, 32]} />
      </mesh>
      {CURLS.map((p, i) => (
        <mesh key={i} position={p} material={materials.marble}>
          <sphereGeometry args={[0.1, 12, 12]} />
        </mesh>
      ))}
      <mesh position={[0, 0.69, 0.37]} material={materials.marble}>
        <sphereGeometry args={[0.045, 10, 10]} />
      </mesh>
      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.17, 0.64, 0.29]} material={materials.rose}>
          <sphereGeometry args={[0.07, 12, 12]} />
        </mesh>
      ))}

      {/* Arms */}
      <mesh position={[0.4, 0.2, 0.2]} rotation={[-1.3, 0, -0.35]} material={materials.marble}>
        <capsuleGeometry args={[0.085, 0.36, 6, 12]} />
      </mesh>
      <mesh position={[-0.38, 0.22, 0.08]} rotation={[-0.7, 0, 0.9]} material={materials.marble}>
        <capsuleGeometry args={[0.085, 0.34, 6, 12]} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.17, -0.5, 0.1]} rotation={[0.7, 0, 0.15]} material={materials.marble}>
        <capsuleGeometry args={[0.11, 0.3, 6, 12]} />
      </mesh>
      <mesh position={[-0.17, -0.52, -0.06]} rotation={[-0.35, 0, -0.15]} material={materials.marble}>
        <capsuleGeometry args={[0.11, 0.3, 6, 12]} />
      </mesh>

      {/* Wings */}
      <Wing side={1} materials={materials} />
      <Wing side={-1} materials={materials} />

      {/* Golden bow with a neon string and heart-tipped arrow, aimed forward (+z) */}
      <group position={[0.46, 0.22, 0.42]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[0, 0, -BOW_ARC / 2]} material={materials.gold}>
          <torusGeometry args={[BOW_RADIUS, 0.025, 8, 40, BOW_ARC]} />
        </mesh>
        <mesh position={[STRING_X, 0, 0]} material={materials.neon}>
          <cylinderGeometry args={[0.006, 0.006, 2 * BOW_RADIUS * Math.sin(BOW_ARC / 2), 6]} />
        </mesh>
        <mesh
          position={[(STRING_X + ARROW_END) / 2, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          material={materials.gold}
        >
          <cylinderGeometry args={[0.012, 0.012, ARROW_END - STRING_X, 6]} />
        </mesh>
        <mesh
          position={[ARROW_END + 0.02, 0, 0]}
          rotation={[0, Math.PI / 2, -Math.PI / 2]}
          scale={0.09}
          geometry={heartGeometry}
          material={materials.heart}
        />
      </group>
    </group>
  );
}
