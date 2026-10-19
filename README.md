<div align="center">

# ✨ Aditya Mukherjee — Portfolio

### A 3D scrollytelling portfolio built with React Three Fiber

Scroll down, and the camera glides through a hand-built, fully procedural desk diorama —
a monitor running real code, a desk lamp that flickers, a window looking out over a
synthesized night skyline, and a bookshelf you can click on to jump straight to **Skills**.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&labelColor=20232a)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-0.186-black?logo=three.js&logoColor=white)](https://threejs.org)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.x-ff69b4)](https://docs.pmnd.rs/react-three-fiber)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License](https://img.shields.io/badge/license-personal%20project-lightgrey)](#license)

</div>

---

## What this is

A single-page portfolio where the "hero image" is an entire 3D room, not a photo. Instead
of a drag-to-orbit or drivable game world (the Bruno Simon school of portfolio sites), the
camera follows a fixed, hand-tuned path through the scene as you scroll — so it works the
same whether you're on a trackpad, a touchscreen, or a mouse wheel, and never requires the
visitor to learn a control scheme.

Every surface in the scene — the wood-plank floor, the woven rug, the plaster walls, the
night skyline out the window, the IDE-style code on the monitor — is a texture **generated
at runtime** with the Canvas 2D API. The one exception is deliberate: a real historical
photograph for the one thing that actually needed to look like a real human face.

## Highlights

| | |
|---|---|
| 🎥 **Scroll-driven camera** | A `CatmullRomCurve3` through hand-placed keyframes, one per section, with a tiny idle "breathing" float layered on top so the shot never looks frozen |
| 🖼️ **Procedural everything** | Floor, rug, walls, night cityscape, and the monitor's live-looking code editor are all `<canvas>`-drawn textures — zero external image downloads for the scene itself |
| 🏛️ **One real photo, on purpose** | A face is exactly the kind of content canvas primitives can't fake convincingly — so the one portrait in the scene is a genuine public-domain photograph, framed and standing on the desk |
| 🖱️ **Clickable 3D hotspots** | Click the monitor, bookshelf, mug, framed art, or window in the scene itself to jump straight to that section — the diorama doubles as navigation |
| 🎬 **Intro reveal** | The camera holds a wide establishing shot behind the loading screen, then eases into the hero position the instant loading finishes |
| 📊 **Real loading screen** | A genuine progress bar driven by `useProgress()`, not a spinner that lies |
| ⚡ **Device-aware quality tiers** | Low-end/mobile devices get capped pixel ratio, no shadows, no particles, and the entire post-processing pipeline skipped — same philosophy as big WebGL showcases, scaled to this project's size |
| 🎧 **Synthesized ambient audio** | An opt-in ambience toggle generates its pad entirely with the Web Audio API — no MP3 to host, nothing to download |
| 🌸 **Bloom, vignette, grain** | A light post-processing pass ties the glowing elements (screen, window, lamp) together into something that reads as photographed, not flat-rendered |

## Tech stack

- **[React 19](https://react.dev)** + **[Vite](https://vite.dev)** — app shell and dev/build tooling
- **[Three.js](https://threejs.org)** via **[@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)** — the 3D scene, declaratively
- **[@react-three/drei](https://github.com/pmndrs/drei)** — `ScrollControls`, `useProgress`, `ContactShadows`, `Environment`, `Stars`, `Sparkles`, and friends
- **[@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)** — `Bloom`, `Vignette`, `Noise`
- **Web Audio API** (no library) — the ambient sound layer
- **Canvas 2D API** (no library) — every procedural texture in the scene
- **[oxlint](https://oxc.rs)** — fast linting

No asset pipeline, no CMS, no backend. Content lives in one data file; the scene is code.

## Project structure

```
src/
├─ App.jsx                   # Canvas setup, device-tier wiring, loading overlay
├─ data/
│  └─ content.js              # All section copy — the only file you need to edit for content
├─ components/                # DOM overlay — one component per section
│  ├─ Hero.jsx  About.jsx  Skills.jsx  ExperienceSection.jsx  Projects.jsx  Contact.jsx
│  └─ ContentSections.jsx     # Maps content.js entries to the right component
├─ scene/                     # Everything inside the <Canvas>
│  ├─ Experience.jsx          # Scene root: lights, diorama, particles, post-processing
│  ├─ Diorama.jsx             # The desk/room geometry — every mesh in the scene
│  ├─ CameraRig.jsx           # Scroll-driven camera curve + idle float + intro reveal
│  ├─ cameraPath.js           # The keyframes CameraRig interpolates through
│  ├─ Hotspots.jsx            # Clickable regions that jump the scroll position
│  ├─ Lights.jsx              # Key/fill/rim lights, tier-aware shadow settings
│  └─ textures.js             # Every procedurally-generated canvas texture
├─ hooks/
│  ├─ useSectionReveal.js     # Scroll-position-driven fade/slide for each DOM section
│  ├─ useDeviceTier.js        # Low/high quality tier detection
│  └─ useAmbientSound.js      # Web Audio synth for the ambient pad
└─ ui/
   ├─ LoadingOverlay.jsx      # Real progress bar before first paint
   └─ SoundToggle.jsx         # Opt-in ambient sound button
```

## Getting started

```bash
npm install
npm run dev        # starts the Vite dev server with HMR
```

```bash
npm run build       # production build to dist/
npm run preview      # serve the production build locally
npm run lint          # oxlint
```

## Customizing

**Content.** Everything visitor-facing text lives in `src/data/content.js` — name, bio,
skills, work history, project cards, contact links. Each section declares a `scrollPages`
weight controlling how much of the scroll it gets relative to the others; `TOTAL_PAGES`
must equal the sum.

**Camera.** `src/scene/cameraPath.js` holds one `{ position, target }` keyframe per
section. `CameraRig.jsx` builds a smooth curve through them and reads scroll progress to
interpolate — tweak the keyframes to reframe any shot without touching the camera logic.

**The scene itself.** `Diorama.jsx` is one big functional component containing every mesh
in the room, organized top-to-bottom roughly as you'd walk through it (floor → walls →
desk → desk clutter → chair → bookshelf → wall art → ceiling). `textures.js` holds every
canvas-texture generator it uses.

**Quality tiers.** `useDeviceTier.js` combines a few signals (pointer type, viewport size,
UA, core count, device memory) into a `'low' | 'high'` tier, consumed by `App.jsx` (pixel
ratio, shadows) and `Experience.jsx` (particle counts, post-processing).

## Credits

- The Srinivasa Ramanujan photograph (1919) is in the public domain — he died in 1920,
  and the image predates 1923. No attribution is legally required, but it's included here
  out of respect for the subject.
- Everything else in the 3D scene — textures, the code shown on the monitor, the night
  skyline, the ambient audio — is generated at runtime; there are no other external
  assets to credit.

## License

This is a personal portfolio, not a reusable library — feel free to look through the code
for ideas, but please don't republish it as your own portfolio.

---

<div align="center">

Built by **[Aditya Mukherjee](https://github.com/ESAditya1729)** · Cloud Data Engineer @ IBM

[GitHub](https://github.com/ESAditya1729) · [LinkedIn](https://linkedin.com/in/theadityamukherjee) · adityamukherjee1729@gmail.com

</div>
