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

// Small engraved brass museum placard — canvas text rendering is exactly
// what canvas 2D primitives ARE good at (unlike rendering a human face),
// so this carries the name/dates/quote that a real photo can't.
export function useNamePlateTexture(line1, line2, quote) {
  return useMemo(
    () =>
      makeCanvasTexture(512, 160, (ctx, w, h) => {
        const brass = ctx.createLinearGradient(0, 0, 0, h)
        brass.addColorStop(0, '#8a7340')
        brass.addColorStop(0.5, '#c9ad68')
        brass.addColorStop(1, '#7a6434')
        ctx.fillStyle = brass
        ctx.fillRect(0, 0, w, h)

        for (let i = 0; i < 400; i++) {
          ctx.globalAlpha = 0.03 + Math.random() * 0.04
          ctx.fillStyle = Math.random() > 0.5 ? '#fff6dc' : '#3a2e14'
          ctx.fillRect(Math.random() * w, Math.random() * h, 1.2, 1.2)
        }
        ctx.globalAlpha = 1

        ctx.strokeStyle = 'rgba(40,30,10,0.5)'
        ctx.lineWidth = 3
        ctx.strokeRect(4, 4, w - 8, h - 8)

        ctx.textAlign = 'center'
        ctx.fillStyle = '#2a2008'
        ctx.font = `bold ${Math.floor(h * 0.24)}px Georgia, serif`
        ctx.fillText(line1, w / 2, h * 0.36)

        ctx.font = `italic ${Math.floor(h * 0.15)}px Georgia, serif`
        ctx.fillStyle = '#3a2c10'
        ctx.fillText(line2, w / 2, h * 0.56)

        if (quote) {
          ctx.font = `italic ${Math.floor(h * 0.1)}px Georgia, serif`
          ctx.fillStyle = '#4a3a18'
          ctx.fillText(quote, w / 2, h * 0.8)
        }
      }),
    [line1, line2, quote],
  )
}
