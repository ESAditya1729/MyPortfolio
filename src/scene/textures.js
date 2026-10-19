import { useMemo } from 'react'
import * as THREE from 'three'

function makeCanvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h || w
  draw(canvas.getContext('2d'), w, h || w)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

// Rich dark-wood plank floor — alternating plank widths with grain lines.
export function useFloorTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(512, 512, (ctx, w, h) => {
        // Base wood tone
        ctx.fillStyle = '#1a1108'
        ctx.fillRect(0, 0, w, h)

        const plankColors = ['#1e1509', '#231a0a', '#1a1208', '#251c0c', '#1c1409']
        const plankWidths = [52, 44, 56, 48, 60, 42, 54]
        let y = 0
        let row = 0

        while (y < h) {
          const plankH = 44 + (row % 3) * 8
          const offsetX = (row % 2) * 28
          let x = -offsetX

          ctx.fillStyle = plankColors[row % plankColors.length]
          ctx.fillRect(0, y, w, plankH)

          // Horizontal grain lines
          for (let g = 0; g < 5; g++) {
            const gy = y + (plankH / 5) * g + 2
            ctx.strokeStyle = 'rgba(0,0,0,0.18)'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(0, gy)
            ctx.lineTo(w, gy + (Math.random() - 0.5) * 2)
            ctx.stroke()
          }

          // Plank divider gap
          ctx.fillStyle = 'rgba(0,0,0,0.55)'
          ctx.fillRect(0, y + plankH - 1, w, 1.5)

          // Vertical plank seams
          x = -offsetX
          let pw = 0
          while (x < w + 60) {
            pw = plankWidths[(row + Math.floor(x / 10)) % plankWidths.length]
            ctx.fillStyle = 'rgba(0,0,0,0.45)'
            ctx.fillRect(x, y, 1, plankH)
            x += pw
          }

          y += plankH + 1
          row++
        }

        // Subtle noise overlay
        for (let i = 0; i < 1800; i++) {
          ctx.globalAlpha = 0.025 + Math.random() * 0.035
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000'
          const px = Math.random() * w
          const py = Math.random() * h
          ctx.fillRect(px, py, 1.2, 1.2)
        }
        ctx.globalAlpha = 1

        // Radial vignette — fakes contact shadow/AO where the floor meets the
        // walls (circleGeometry's own UVs inscribe the circle in this square,
        // so darkening near the canvas edge reads as darkening near the room's
        // perimeter without needing separate wall-aligned geometry).
        const vignette = ctx.createRadialGradient(w / 2, h / 2, w * 0.16, w / 2, h / 2, w * 0.5)
        vignette.addColorStop(0, 'rgba(0,0,0,0)')
        vignette.addColorStop(1, 'rgba(0,0,0,0.5)')
        ctx.fillStyle = vignette
        ctx.fillRect(0, 0, w, h)
      }),
    [],
  )
}

// Woven rug — geometric diamond + concentric ring pattern with a richer palette.
export function useRugTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(512, 512, (ctx, size) => {
        const c = size / 2

        // Background
        ctx.fillStyle = '#1a1520'
        ctx.fillRect(0, 0, size, size)

        // Diamond grid pattern
        ctx.strokeStyle = 'rgba(240, 115, 64, 0.12)'
        ctx.lineWidth = 0.8
        for (let i = 0; i < size; i += 18) {
          ctx.beginPath()
          ctx.moveTo(i, 0)
          ctx.lineTo(0, i)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(i, size)
          ctx.lineTo(size, i)
          ctx.stroke()
        }

        // Concentric rings with color variation
        const ringColors = [
          'rgba(240, 115, 64, 0.28)',
          'rgba(255, 107, 157, 0.20)',
          'rgba(78, 205, 190, 0.16)',
          'rgba(167, 139, 250, 0.14)',
          'rgba(240, 115, 64, 0.22)',
          'rgba(255, 107, 157, 0.15)',
          'rgba(78, 205, 190, 0.12)',
          'rgba(255, 255, 255, 0.06)',
        ]
        let ringIdx = 0
        for (let r = size * 0.48; r > size * 0.04; r -= size * 0.058) {
          ctx.strokeStyle = ringColors[ringIdx % ringColors.length]
          ctx.lineWidth = size * 0.014
          ctx.beginPath()
          ctx.arc(c, c, r, 0, Math.PI * 2)
          ctx.stroke()
          ringIdx++
        }

        // Center motif — small star shape
        ctx.save()
        ctx.translate(c, c)
        for (let i = 0; i < 8; i++) {
          ctx.rotate(Math.PI / 4)
          ctx.strokeStyle = 'rgba(240, 115, 64, 0.45)'
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(0, size * 0.04)
          ctx.lineTo(0, size * 0.12)
          ctx.stroke()
        }
        ctx.restore()

        // Outer border
        ctx.strokeStyle = 'rgba(240, 115, 64, 0.38)'
        ctx.lineWidth = size * 0.018
        ctx.strokeRect(size * 0.045, size * 0.045, size * 0.91, size * 0.91)
      }),
    [],
  )
}

// Richer monitor screen: dark IDE with syntax-highlighted code, file tabs, minimap.
export function useScreenTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(1024, 600, (ctx, w, h) => {
        // Background — dark editor theme
        ctx.fillStyle = '#0d1117'
        ctx.fillRect(0, 0, w, h)

        // Title bar
        ctx.fillStyle = '#161b22'
        ctx.fillRect(0, 0, w, h * 0.075)

        // Window traffic lights
        ;[['#ff5f56', 0], ['#ffbd2e', 1], ['#27c93f', 2]].forEach(([color, i]) => {
          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(w * 0.025 + i * w * 0.025, h * 0.038, w * 0.009, 0, Math.PI * 2)
          ctx.fill()
        })

        // File tabs
        const tabs = ['pipeline.py', 'etl_job.py', 'api_main.js', 'App.jsx']
        tabs.forEach((tab, i) => {
          const active = i === 0
          const tx = w * 0.12 + i * w * 0.14
          ctx.fillStyle = active ? '#0d1117' : 'transparent'
          if (active) {
            ctx.fillRect(tx - w * 0.006, 0, w * 0.13, h * 0.075)
            ctx.fillStyle = '#3b82f6'
            ctx.fillRect(tx - w * 0.006, h * 0.072, w * 0.13, 2)
          }
          ctx.font = `${Math.floor(h * 0.045)}px "JetBrains Mono", monospace`
          ctx.fillStyle = active ? '#e6edf3' : '#6e7681'
          ctx.fillText(tab, tx, h * 0.052)
        })

        // Left gutter / line numbers
        ctx.fillStyle = '#161b22'
        ctx.fillRect(0, h * 0.075, w * 0.055, h)

        // Side minimap
        ctx.fillStyle = '#0d1117'
        ctx.fillRect(w * 0.87, h * 0.075, w * 0.13, h)
        for (let i = 0; i < 40; i++) {
          const my = h * 0.09 + i * h * 0.022
          const mw = (0.04 + Math.random() * 0.06) * w * 0.12
          ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '125,211,252' : '167,139,250'},0.35)`
          ctx.fillRect(w * 0.875, my, mw, 3)
        }

        // Code lines — realistic syntax highlighting
        const syntax = [
          // Line: import statement
          [
            ['#ff7b72', 'import '],
            ['#e6edf3', 'azure.storage.blob '],
            ['#ff7b72', 'import '],
            ['#79c0ff', 'BlobServiceClient'],
          ],
          // Line: blank
          [],
          // Line: class def
          [
            ['#ff7b72', 'class '],
            ['#ffa657', 'DataPipeline'],
            ['#e6edf3', ':'],
          ],
          // Line: def
          [
            ['#e6edf3', '    '],
            ['#ff7b72', 'def '],
            ['#d2a8ff', '__init__'],
            ['#e6edf3', '('],
            ['#ffa657', 'self'],
            ['#e6edf3', ', conn_str):'],
          ],
          // Line: self.client
          [
            ['#e6edf3', '        '],
            ['#79c0ff', 'self'],
            ['#e6edf3', '.client = '],
            ['#79c0ff', 'BlobServiceClient'],
            ['#e6edf3', '.from_connection_string(conn_str)'],
          ],
          [],
          // Line: def run
          [
            ['#e6edf3', '    '],
            ['#ff7b72', 'async def '],
            ['#d2a8ff', 'run_etl'],
            ['#e6edf3', '('],
            ['#ffa657', 'self'],
            ['#e6edf3', ', src, dst):'],
          ],
          // Line: comment
          [
            ['#8b949e', '        # Load from Azure Data Lake → transform → write Delta'],
          ],
          // Line: await
          [
            ['#e6edf3', '        df = '],
            ['#ff7b72', 'await '],
            ['#79c0ff', 'self'],
            ['#e6edf3', '.spark.read.parquet(src)'],
          ],
          // Line: filter
          [
            ['#e6edf3', '        df = df.filter(df.status == '],
            ['#a5d6ff', '"active"'],
            ['#e6edf3', ')'],
          ],
          // Line: write
          [
            ['#e6edf3', '        df.write.format('],
            ['#a5d6ff', '"delta"'],
            ['#e6edf3', ').mode('],
            ['#a5d6ff', '"overwrite"'],
            ['#e6edf3', ').save(dst)'],
          ],
        ]

        const lineH = h * 0.072
        const startY = h * 0.12

        syntax.forEach((tokens, i) => {
          const y = startY + i * lineH
          const lineNum = i + 1

          // Line number in gutter
          ctx.font = `${Math.floor(h * 0.044)}px "JetBrains Mono", monospace`
          ctx.fillStyle = '#3d444d'
          ctx.textAlign = 'right'
          ctx.fillText(String(lineNum), w * 0.048, y)
          ctx.textAlign = 'left'

          // Highlight active line background
          if (i === 8) {
            ctx.fillStyle = 'rgba(125,211,252,0.06)'
            ctx.fillRect(w * 0.055, y - lineH * 0.75, w * 0.81, lineH)
          }

          let x = w * 0.065
          tokens.forEach(([color, text]) => {
            ctx.font = `${Math.floor(h * 0.048)}px "JetBrains Mono", monospace`
            ctx.fillStyle = color
            ctx.fillText(text, x, y)
            x += ctx.measureText(text).width
          })
        })

        // Cursor blink (drawn at line 9)
        const cursorY = startY + 8 * lineH
        ctx.fillStyle = 'rgba(229, 229, 229, 0.85)'
        ctx.fillRect(w * 0.065 + w * 0.042, cursorY - lineH * 0.7, 2, lineH * 0.85)

        // Status bar at the bottom
        ctx.fillStyle = '#1f6feb'
        ctx.fillRect(0, h * 0.93, w, h * 0.07)
        ctx.font = `${Math.floor(h * 0.04)}px "JetBrains Mono", monospace`
        ctx.fillStyle = '#ffffff'
        ctx.fillText(' ⎇  main   Python 3.11   UTF-8   Spaces: 4   ✓ Azure DevOps CI/CD', w * 0.01, h * 0.975)
      }),
    [],
  )
}

// Night cityscape seen through the window — gradient sky, a soft moon,
// scattered stars, and a skyline of buildings with individually lit windows.
// Replaces the old flat glowing rectangle, which was the least convincing
// surface in the scene next to the richly textured floor/rug/screen.
export function useCityscapeTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(512, 640, (ctx, w, h) => {
        const sky = ctx.createLinearGradient(0, 0, 0, h)
        sky.addColorStop(0, '#060a18')
        sky.addColorStop(0.55, '#0a1228')
        sky.addColorStop(1, '#131a30')
        ctx.fillStyle = sky
        ctx.fillRect(0, 0, w, h)

        // Moon
        ctx.save()
        ctx.shadowColor = 'rgba(220,230,255,0.9)'
        ctx.shadowBlur = 28
        ctx.fillStyle = '#eef3ff'
        ctx.beginPath()
        ctx.arc(w * 0.76, h * 0.18, w * 0.05, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Stars
        for (let i = 0; i < 90; i++) {
          ctx.globalAlpha = 0.25 + Math.random() * 0.55
          ctx.fillStyle = '#ffffff'
          const x = Math.random() * w
          const y = Math.random() * h * 0.55
          ctx.fillRect(x, y, 1.3, 1.3)
        }
        ctx.globalAlpha = 1

        // Skyline — two passes at different depths for a parallax-like layering
        const layers = [
          { base: h * 0.74, color: '#0c1324', jitter: 0.16, count: 9 },
          { base: h * 0.82, color: '#070b16', jitter: 0.22, count: 7 },
        ]
        layers.forEach(({ base, color, jitter, count }) => {
          let x = -20
          for (let i = 0; i < count; i++) {
            const bw = w / count + Math.random() * 20
            const bh = h * jitter * (0.5 + Math.random())
            ctx.fillStyle = color
            ctx.fillRect(x, base - bh, bw, h - (base - bh))

            // Lit windows
            const cols = Math.max(2, Math.floor(bw / 14))
            const rows = Math.max(2, Math.floor(bh / 16))
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                if (Math.random() > 0.62) {
                  ctx.globalAlpha = 0.5 + Math.random() * 0.5
                  ctx.fillStyle = Math.random() > 0.75 ? '#ffd9a0' : '#ffe9c4'
                  ctx.fillRect(x + 4 + c * 14, base - bh + 6 + r * 16, 6, 8)
                }
              }
            }
            ctx.globalAlpha = 1
            x += bw + 4
          }
        })

        // Faint ground-glow haze near the base (city light pollution)
        const haze = ctx.createLinearGradient(0, h * 0.78, 0, h)
        haze.addColorStop(0, 'rgba(255,170,90,0)')
        haze.addColorStop(1, 'rgba(255,170,90,0.12)')
        ctx.fillStyle = haze
        ctx.fillRect(0, h * 0.78, w, h * 0.22)
      }),
    [],
  )
}

// Wall texture for the back wall — subtle plaster with faint grid
export function useWallTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(256, 256, (ctx, size) => {
        ctx.fillStyle = '#1e2030'
        ctx.fillRect(0, 0, size, size)

        // Very subtle noise
        for (let i = 0; i < 2000; i++) {
          ctx.globalAlpha = 0.015 + Math.random() * 0.025
          ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000'
          ctx.fillRect(Math.random() * size, Math.random() * size, 1.5, 1.5)
        }

        // Faint horizontal brush lines
        for (let y = 0; y < size; y += 3) {
          ctx.globalAlpha = 0.03 + Math.random() * 0.03
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(size, y + (Math.random() - 0.5) * 1)
          ctx.stroke()
        }
        ctx.globalAlpha = 1

        // Symmetric top/bottom edge darkening — fakes AO where the wall meets
        // the floor and the ceiling. Darkening both edges equally (rather than
        // just one) sidesteps any texture.flipY / UV-orientation guesswork —
        // it reads correctly regardless of which edge ends up "up" on the mesh.
        const edgeFade = ctx.createLinearGradient(0, 0, 0, size)
        edgeFade.addColorStop(0, 'rgba(0,0,0,0.4)')
        edgeFade.addColorStop(0.14, 'rgba(0,0,0,0)')
        edgeFade.addColorStop(0.86, 'rgba(0,0,0,0)')
        edgeFade.addColorStop(1, 'rgba(0,0,0,0.4)')
        ctx.fillStyle = edgeFade
        ctx.fillRect(0, 0, size, size)
      }),
    [],
  )
}

// Stylised sepia portrait of Srinivasa Ramanujan — drawn entirely with
// canvas 2D primitives so there's no external asset to load or host.
// Palette: aged-photograph sepia (warm tans, deep browns, cream whites).
export function useRamanujanTexture() {
  return useMemo(
    () =>
      makeCanvasTexture(400, 520, (ctx, w, h) => {
        // ── Background — aged cream paper ──
        const bg = ctx.createRadialGradient(w / 2, h * 0.45, w * 0.05, w / 2, h * 0.45, w * 0.72)
        bg.addColorStop(0, '#e8dcc8')
        bg.addColorStop(0.6, '#d4c4a0')
        bg.addColorStop(1, '#b8a478')
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, w, h)

        // ── Aged paper noise / grain ──
        for (let i = 0; i < 3000; i++) {
          ctx.globalAlpha = 0.018 + Math.random() * 0.022
          ctx.fillStyle = Math.random() > 0.55 ? '#6b4a20' : '#fffae8'
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2)
        }
        ctx.globalAlpha = 1

        // ── Vignette ──
        const vig = ctx.createRadialGradient(w / 2, h * 0.42, w * 0.22, w / 2, h * 0.42, w * 0.75)
        vig.addColorStop(0, 'rgba(0,0,0,0)')
        vig.addColorStop(0.65, 'rgba(0,0,0,0)')
        vig.addColorStop(1, 'rgba(60,30,0,0.55)')
        ctx.fillStyle = vig
        ctx.fillRect(0, 0, w, h)

        // helper: sepia tone fill
        const S = (l) => `hsl(30,${Math.round(30 + l * 0.3)}%,${Math.round(l)}%)`

        // ── Suit / jacket body ──
        ctx.fillStyle = '#3a2810'
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.88, w * 0.38, h * 0.28, 0, 0, Math.PI * 2)
        ctx.fill()

        // Jacket lapels
        ctx.fillStyle = '#2c1e0a'
        ctx.beginPath()
        ctx.moveTo(w * 0.5, h * 0.68)
        ctx.lineTo(w * 0.38, h * 0.76)
        ctx.lineTo(w * 0.44, h * 0.90)
        ctx.lineTo(w * 0.5, h * 0.76)
        ctx.closePath()
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(w * 0.5, h * 0.68)
        ctx.lineTo(w * 0.62, h * 0.76)
        ctx.lineTo(w * 0.56, h * 0.90)
        ctx.lineTo(w * 0.5, h * 0.76)
        ctx.closePath()
        ctx.fill()

        // Shirt / collar
        ctx.fillStyle = '#e8dcc0'
        ctx.beginPath()
        ctx.moveTo(w * 0.44, h * 0.68)
        ctx.lineTo(w * 0.56, h * 0.68)
        ctx.lineTo(w * 0.53, h * 0.78)
        ctx.lineTo(w * 0.47, h * 0.78)
        ctx.closePath()
        ctx.fill()

        // Neck
        ctx.fillStyle = S(50)
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.63, w * 0.065, h * 0.055, 0, 0, Math.PI * 2)
        ctx.fill()

        // ── Head ──
        // Head shape — slightly elongated oval
        ctx.fillStyle = S(52)
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.42, w * 0.195, h * 0.215, 0, 0, Math.PI * 2)
        ctx.fill()

        // Forehead highlight
        const fhGrad = ctx.createRadialGradient(w * 0.5, h * 0.30, 0, w * 0.5, h * 0.33, w * 0.14)
        fhGrad.addColorStop(0, 'rgba(255,240,210,0.35)')
        fhGrad.addColorStop(1, 'rgba(255,240,210,0)')
        ctx.fillStyle = fhGrad
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.33, w * 0.14, h * 0.09, 0, 0, Math.PI * 2)
        ctx.fill()

        // Temple shadow
        ;[[-1, 0.32], [1, 0.68]].forEach(([side, xp]) => {
          const tg = ctx.createRadialGradient(w * xp, h * 0.4, 0, w * xp, h * 0.4, w * 0.1)
          tg.addColorStop(0, 'rgba(60,30,5,0.22)')
          tg.addColorStop(1, 'rgba(60,30,5,0)')
          ctx.fillStyle = tg
          ctx.beginPath()
          ctx.ellipse(w * xp, h * 0.41, w * 0.1, h * 0.13, 0, 0, Math.PI * 2)
          ctx.fill()
        })

        // ── Hair — dense dark mass on top ──
        ctx.fillStyle = '#1a0e05'
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.265, w * 0.195, h * 0.09, 0, 0, Math.PI * 2)
        ctx.fill()
        // Side hair
        ctx.beginPath()
        ctx.ellipse(w * 0.315, h * 0.38, w * 0.075, h * 0.11, -0.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(w * 0.685, h * 0.38, w * 0.075, h * 0.11, 0.3, 0, Math.PI * 2)
        ctx.fill()
        // Hair parting line
        ctx.strokeStyle = '#0d0804'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(w * 0.46, h * 0.22)
        ctx.quadraticCurveTo(w * 0.51, h * 0.26, w * 0.54, h * 0.3)
        ctx.stroke()

        // ── Eyebrows ──
        ctx.strokeStyle = '#2a1808'
        ctx.lineWidth = 3.5
        ctx.lineCap = 'round'
        ;[[0.385, 0.41, 0.435, 0.395], [0.565, 0.395, 0.615, 0.41]].forEach(([x1, y1, x2, y2]) => {
          ctx.beginPath()
          ctx.moveTo(w * x1, h * y1)
          ctx.quadraticCurveTo(w * ((x1 + x2) / 2), h * (Math.min(y1, y2) - 0.01), w * x2, h * y2)
          ctx.stroke()
        })

        // ── Eyes ──
        ;[0.405, 0.595].forEach((ex) => {
          // Eye white
          ctx.fillStyle = '#f0e8d5'
          ctx.beginPath()
          ctx.ellipse(w * ex, h * 0.445, w * 0.038, h * 0.023, 0, 0, Math.PI * 2)
          ctx.fill()
          // Iris
          ctx.fillStyle = '#1c0e04'
          ctx.beginPath()
          ctx.arc(w * ex, h * 0.445, w * 0.022, 0, Math.PI * 2)
          ctx.fill()
          // Catchlight
          ctx.fillStyle = 'rgba(255,250,235,0.65)'
          ctx.beginPath()
          ctx.arc(w * ex + w * 0.008, h * 0.44, w * 0.006, 0, Math.PI * 2)
          ctx.fill()
          // Eyelid crease
          ctx.strokeStyle = S(38)
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.ellipse(w * ex, h * 0.445, w * 0.038, h * 0.02, 0, Math.PI, 0)
          ctx.stroke()
        })

        // ── Nose ──
        ctx.strokeStyle = S(42)
        ctx.lineWidth = 2
        ctx.lineJoin = 'round'
        ctx.beginPath()
        ctx.moveTo(w * 0.488, h * 0.46)
        ctx.quadraticCurveTo(w * 0.482, h * 0.505, w * 0.468, h * 0.518)
        ctx.quadraticCurveTo(w * 0.455, h * 0.525, w * 0.458, h * 0.535)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(w * 0.512, h * 0.46)
        ctx.quadraticCurveTo(w * 0.518, h * 0.505, w * 0.532, h * 0.518)
        ctx.quadraticCurveTo(w * 0.545, h * 0.525, w * 0.542, h * 0.535)
        ctx.stroke()
        // Nostril line
        ctx.beginPath()
        ctx.moveTo(w * 0.458, h * 0.535)
        ctx.quadraticCurveTo(w * 0.5, h * 0.542, w * 0.542, h * 0.535)
        ctx.stroke()

        // ── Mouth ──
        ctx.strokeStyle = S(36)
        ctx.lineWidth = 2.2
        ctx.beginPath()
        ctx.moveTo(w * 0.458, h * 0.576)
        ctx.quadraticCurveTo(w * 0.5, h * 0.585, w * 0.542, h * 0.576)
        ctx.stroke()
        // Upper lip bow
        ctx.beginPath()
        ctx.moveTo(w * 0.462, h * 0.576)
        ctx.quadraticCurveTo(w * 0.5, h * 0.568, w * 0.538, h * 0.576)
        ctx.stroke()

        // ── Ear shadows ──
        ;[[0.305, 0.445], [0.695, 0.445]].forEach(([ex, ey]) => {
          ctx.fillStyle = S(43)
          ctx.beginPath()
          ctx.ellipse(w * ex, h * ey, w * 0.028, h * 0.042, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = S(35)
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.ellipse(w * ex, h * ey, w * 0.018, h * 0.028, 0, 0, Math.PI * 2)
          ctx.stroke()
        })

        // ── Lower face shadow / jaw ──
        const jawGrad = ctx.createLinearGradient(0, h * 0.56, 0, h * 0.64)
        jawGrad.addColorStop(0, 'rgba(0,0,0,0)')
        jawGrad.addColorStop(1, 'rgba(40,20,5,0.22)')
        ctx.fillStyle = jawGrad
        ctx.beginPath()
        ctx.ellipse(w * 0.5, h * 0.6, w * 0.18, h * 0.07, 0, 0, Math.PI * 2)
        ctx.fill()

        // ── Name label ──
        ctx.fillStyle = '#2c1a08'
        ctx.font = `bold ${Math.floor(w * 0.065)}px Georgia, serif`
        ctx.textAlign = 'center'
        ctx.letterSpacing = '0.06em'
        ctx.fillText('S. Ramanujan', w * 0.5, h * 0.905)

        // ── Dates ──
        ctx.fillStyle = '#5a3a18'
        ctx.font = `italic ${Math.floor(w * 0.042)}px Georgia, serif`
        ctx.fillText('1887 — 1920', w * 0.5, h * 0.935)

        // ── Quote ──
        ctx.fillStyle = '#7a5228'
        ctx.font = `italic ${Math.floor(w * 0.032)}px Georgia, serif`
        ctx.fillText('"An equation has no meaning unless', w * 0.5, h * 0.962)
        ctx.fillText('it expresses a thought of God."', w * 0.5, h * 0.983)

        // ── Decorative border inside the canvas ──
        ctx.strokeStyle = 'rgba(100,65,20,0.55)'
        ctx.lineWidth = 4
        ctx.strokeRect(8, 8, w - 16, h - 16)
        ctx.strokeStyle = 'rgba(100,65,20,0.25)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(14, 14, w - 28, h - 28)
      }),
    [],
  )
}
