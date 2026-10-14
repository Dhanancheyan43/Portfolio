import { lazy, Suspense } from 'react'
import { profile } from './content.js'

const Scene = lazy(() => import('./three/Scene.jsx'))

export default function App() {
  return (
    <>
      <Suspense fallback={<div className="scene scene--loading" />}>
        <Scene />
      </Suspense>

      <main className="overlay">
        <aside className="hud" aria-hidden="true">
          <span className="hud__bracket" />
          {profile.motto.map((word, i) => (
            <span key={i}>{word}</span>
          ))}
          <span className="hud__bars">
            {Array.from({ length: 9 }, (_, i) => (
              <i key={i} style={{ animationDelay: `${i * 0.17}s` }} />
            ))}
          </span>
        </aside>

        <section className="hero">
          <p className="eyebrow">// portfolio · 2026</p>
          <h1>
            {profile.name}
            <span className="role">{profile.role}</span>
          </h1>
          <p className="tagline">{profile.tagline}</p>
          <p className="hint">Move your cursor · hover a peony</p>
        </section>
      </main>
    </>
  )
}
