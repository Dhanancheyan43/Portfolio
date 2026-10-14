import { Canvas, useFrame } from '@react-three/fiber';
import { Cloud, Clouds, Grid, Sparkles } from '@react-three/drei';
import { AnimatePresence, motion } from 'framer-motion';
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject, ReactNode } from 'react';
import * as THREE from 'three';
import Cupid from './Cupid';
import { heartGeometry } from './heart';

const PART_DURATION = 1.8;

type IntroProps = {
  onFinish: () => void;
};

// Soft puffy sprite generated on a canvas so the clouds need no external texture.
function createCloudTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const puffs: [number, number, number][] = [
    [128, 140, 95],
    [86, 150, 62],
    [172, 150, 64],
    [108, 108, 58],
    [152, 110, 54],
    [128, 172, 70],
  ];
  for (const [x, y, r] of puffs) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.85)');
    g.addColorStop(0.55, 'rgba(255,255,255,0.35)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvas.toDataURL();
}

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function PartingDriver({
  started,
  progress,
  onDone,
}: {
  started: boolean;
  progress: MutableRefObject<number>;
  onDone: () => void;
}) {
  const raw = useRef(0);
  const done = useRef(false);
  useFrame((_, dt) => {
    if (!started || done.current) return;
    raw.current = Math.min(1, raw.current + dt / PART_DURATION);
    progress.current = ease(raw.current);
    if (raw.current >= 1) {
      done.current = true;
      onDone();
    }
  });
  return null;
}

function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  useFrame(({ camera, pointer }, dt) => {
    const p = progress.current;
    const tx = pointer.x * 1.8 * (1 - p);
    const ty = 0.4 + pointer.y * 1 * (1 - p);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 3, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 3, dt);
    camera.position.z = 12 - p * 10;
    camera.lookAt(0, 0.4, -4);
  });
  return null;
}

// Front cloud banks slide apart like curtains when the visitor enters.
function PartingBank({
  side,
  progress,
  children,
}: {
  side: 1 | -1;
  progress: MutableRefObject<number>;
  children: ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) ref.current.position.x = side * progress.current * 16;
  });
  return <group ref={ref}>{children}</group>;
}

function Column3D({ position, height, broken = false }: { position: [number, number, number]; height: number; broken?: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.45, 0.52, height, 20, 1]} />
        <meshStandardMaterial color="#EFE9DE" roughness={0.55} flatShading />
      </mesh>
      {!broken && (
        <>
          <mesh position={[0, height + 0.15, 0]}>
            <cylinderGeometry args={[0.62, 0.46, 0.3, 20]} />
            <meshStandardMaterial color="#F6F1E8" roughness={0.5} />
          </mesh>
          <mesh position={[0, height + 0.4, 0]}>
            <boxGeometry args={[1.5, 0.22, 1.5]} />
            <meshStandardMaterial color="#F6F1E8" roughness={0.5} />
          </mesh>
        </>
      )}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#E6DFD2" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.62, 0.025, 8, 48]} />
        <meshBasicMaterial color="#3DFF9A" toneMapped={false} />
      </mesh>
    </group>
  );
}

function CyberHalo() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.12;
    ref.current.rotation.x += dt * 0.05;
  });
  return (
    <mesh ref={ref} position={[0, 2.5, -16]}>
      <icosahedronGeometry args={[5, 1]} />
      <meshBasicMaterial color="#3DFF9A" wireframe transparent opacity={0.35} toneMapped={false} />
    </mesh>
  );
}

type HeartParticle = { id: number; origin: THREE.Vector3; velocity: THREE.Vector3; spin: number };

function FlyingHeart({ heart, onDone }: { heart: HeartParticle; onDone: (id: number) => void }) {
  const ref = useRef<THREE.Mesh>(null);
  const age = useRef(0);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#FF7FA2',
        emissive: '#FF3D7A',
        emissiveIntensity: 0.7,
        transparent: true,
      }),
    [],
  );
  useFrame((_, dt) => {
    const m = ref.current;
    if (!m) return;
    age.current += dt;
    const t = age.current;
    m.position.copy(heart.origin).addScaledVector(heart.velocity, t);
    m.position.y += t * t * 0.6;
    m.rotation.y = t * heart.spin;
    m.scale.setScalar(0.18 * Math.min(1, t * 6));
    material.opacity = Math.max(0, 1 - t / 1.6);
    if (t > 1.6) onDone(heart.id);
  });
  return <mesh ref={ref} geometry={heartGeometry} material={material} />;
}

function Scene({ started, onDone }: { started: boolean; onDone: () => void }) {
  const progress = useRef(0);
  const cloudTexture = useMemo(createCloudTexture, []);
  const [hearts, setHearts] = useState<HeartParticle[]>([]);
  const nextId = useRef(0);

  const shoot = useCallback((origin: THREE.Vector3) => {
    const burst = Array.from({ length: 7 }, () => ({
      id: nextId.current++,
      origin: origin.clone(),
      velocity: new THREE.Vector3((Math.random() - 0.5) * 3, 0.8 + Math.random() * 1.4, 1.5 + Math.random() * 2),
      spin: (Math.random() - 0.5) * 8,
    }));
    setHearts((h) => [...h, ...burst]);
  }, []);

  const removeHeart = useCallback((id: number) => setHearts((h) => h.filter((p) => p.id !== id)), []);

  return (
    <>
      <ambientLight intensity={1.5} color="#FFF4EC" />
      <directionalLight position={[6, 10, 6]} intensity={1.6} color="#FFF8F0" />
      <pointLight position={[-6, -4, 4]} intensity={60} color="#3DFF9A" distance={30} />
      <pointLight position={[7, 1, 2]} intensity={40} color="#F6B7C9" distance={25} />

      <CameraRig progress={progress} />
      <PartingDriver started={started} progress={progress} onDone={onDone} />

      <CyberHalo />
      <Column3D position={[-8, -4.2, -8]} height={8} />
      <Column3D position={[8.5, -4.2, -9]} height={6} broken />
      <Column3D position={[-12, -4.2, -13]} height={9} />

      <Cupid radiusX={3.6} radiusZ={1.8} center={[0, 0.6, -1]} speed={0.45} phase={0} scale={0.85} onShoot={shoot} />
      <Cupid radiusX={6} radiusZ={2.6} center={[0, 2.2, -4.5]} speed={0.3} phase={2.1} scale={0.8} onShoot={shoot} />
      <Cupid radiusX={2.6} radiusZ={1.4} center={[0.5, -1.2, 1]} speed={-0.55} phase={4} scale={0.7} onShoot={shoot} />

      {hearts.map((h) => (
        <FlyingHeart key={h.id} heart={h} onDone={removeHeart} />
      ))}

      <Sparkles count={70} scale={[18, 10, 10]} position={[0, 1, -3]} size={3} speed={0.35} color="#3DFF9A" />
      <Sparkles count={40} scale={[16, 8, 8]} position={[0, 0, -2]} size={4} speed={0.25} color="#F6B7C9" />

      <Grid
        position={[0, -5.2, 0]}
        args={[60, 60]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1F8F5A"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#3DFF9A"
        fadeDistance={45}
        fadeStrength={1.5}
        infiniteGrid
      />

      <Suspense fallback={null}>
        <Clouds material={THREE.MeshLambertMaterial} texture={cloudTexture} limit={400}>
          {/* Distant pink horizon */}
          <Cloud seed={1} position={[-9, -1.5, -12]} bounds={[7, 2, 2]} segments={30} volume={9} color="#FFD9E4" fade={60} opacity={0.9} speed={0.1} />
          <Cloud seed={2} position={[9, -1, -13]} bounds={[7, 2, 2]} segments={30} volume={9} color="#FFE9EF" fade={60} opacity={0.9} speed={0.1} />
          {/* Cloud floor the cupids fly over */}
          <Cloud seed={3} position={[0, -4.2, -3]} bounds={[12, 1, 4]} segments={40} volume={8} color="#F4FFF8" fade={50} speed={0.15} />
          <Cloud seed={4} position={[0, -4.6, 3]} bounds={[10, 1, 2]} segments={25} volume={6} color="#FFFFFF" fade={40} speed={0.15} />
          {/* Front curtains that part on enter */}
          <PartingBank side={-1} progress={progress}>
            <Cloud seed={5} position={[-6, -1.5, 4.5]} bounds={[3, 3, 1.5]} segments={25} volume={6} color="#FFFFFF" fade={30} speed={0.2} />
            <Cloud seed={6} position={[-7, 3, 2]} bounds={[3, 2, 1.5]} segments={20} volume={6} color="#FFF0F4" fade={30} speed={0.2} />
            <Cloud seed={7} position={[-2.5, -3.6, 6]} bounds={[3, 1, 1]} segments={14} volume={4} color="#FFFFFF" fade={30} speed={0.2} />
          </PartingBank>
          <PartingBank side={1} progress={progress}>
            <Cloud seed={8} position={[6, -1, 4.5]} bounds={[3, 3, 1.5]} segments={25} volume={6} color="#FFFFFF" fade={30} speed={0.2} />
            <Cloud seed={9} position={[7, 3.4, 2]} bounds={[3, 2, 1.5]} segments={20} volume={6} color="#EFFFF6" fade={30} speed={0.2} />
            <Cloud seed={10} position={[2.5, -3.6, 6]} bounds={[3, 1, 1]} segments={14} volume={4} color="#FFFFFF" fade={30} speed={0.2} />
          </PartingBank>
        </Clouds>
      </Suspense>
    </>
  );
}

// If WebGL is unavailable the intro quietly gets out of the way.
class IntroErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CupidIntro({ onFinish }: IntroProps) {
  const [started, setStarted] = useState(false);
  const finished = useRef(false);

  const finish = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    document.body.style.cursor = '';
    onFinish();
  }, [onFinish]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') setStarted(true);
      if (e.key === 'Escape') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [finish]);

  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(180deg, #03100A 0%, #0B3524 32%, #2F7458 55%, #E9B9C8 80%, #FFF1E8 100%)',
      }}
    >
      <IntroErrorBoundary onError={finish}>
        <Canvas
          camera={{ position: [0, 0.4, 12], fov: 50 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          className="!absolute inset-0"
        >
          <Scene started={started} onDone={finish} />
        </Canvas>
      </IntroErrorBoundary>

      <div className="scanlines pointer-events-none absolute inset-0 opacity-40" />

      <AnimatePresence>
        {!started && (
          <motion.div
            key="overlay"
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between px-6 py-6 md:px-10 md:py-8"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            <div className="flex w-full items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mint sm:text-xs">
              <span className="animate-flicker whitespace-nowrap rounded-full bg-ink/80 px-3 py-1.5">
                olympus.sys<span className="hidden sm:inline"> // online</span>
              </span>
              <button
                type="button"
                onClick={finish}
                className="pointer-events-auto whitespace-nowrap rounded-full border border-neon/50 bg-ink/80 px-3 py-1.5 text-neon transition-colors hover:bg-moss"
              >
                skip intro →
              </button>
            </div>

            <motion.div
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-mint/80 sm:text-xs">
                — welcome to the realm of —
              </span>
              <h1
                className="hero-heading mt-2 font-display font-black uppercase leading-none"
                style={{ fontSize: 'clamp(4rem, 16vw, 13rem)' }}
              >
                Jack
              </h1>
              <span
                className="mt-1 font-serif italic text-marble/90"
                style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.9rem)' }}
              >
                sculptor of three-dimensional dreams
              </span>
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9 }}
            >
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="neon-border pointer-events-auto rounded-full border-2 bg-ink/90 px-10 py-3.5 font-cinzel text-sm font-semibold uppercase tracking-[0.3em] text-marble backdrop-blur-md transition-colors hover:bg-moss sm:text-base"
              >
                Enter the realm
              </button>
              <span className="rounded-full bg-ink/80 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-mint backdrop-blur-sm sm:text-[11px]">
                <span className="hidden sm:inline">move your cursor · click a cupid</span>
                <span className="sm:hidden">drag to look · tap a cupid</span>
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
