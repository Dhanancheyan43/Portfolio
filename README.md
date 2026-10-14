# Portfolio — Nature × Technology = Tomorrow

A 3D interactive portfolio built with React, Vite and React Three Fiber. The hero is a procedurally grown
garden of peonies with gilded leaves, emerald "data rain" and glowing circuit rings, inspired by a
marble-statue-meets-cyberpunk reference artwork.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # static site in dist/
npm run build:single # one self-contained HTML file in dist-single/
```

- `src/content.js` — all portfolio copy (name, role, sections)
- `src/theme.js` — the "Digital Renaissance" palette
- `src/three/geometry.js` — procedural peony petals and leaves
- `lab.html` — dev-only close-up of a single peony for tuning geometry (`/lab.html?seed=2&tilt=1.4`)
