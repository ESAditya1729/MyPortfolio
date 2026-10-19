import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useScroll } from '@react-three/drei'
import { TOTAL_PAGES } from '../data/content.js'

// Weighted trapezoid visibility curve.
//
// Each section declares a `scrollPages` weight in content.js. This hook
// converts that into a [start, end] range in 0..1 scroll-offset space,
// proportional to the section's share of TOTAL_PAGES.
//
// The fade window is a fixed fraction of the section's own span, so short
// sections still have readable fade-ins and tall sections never flicker away
// mid-read. The last section is pinned at opacity:1 once reached.
export function useSectionReveal(index, total, sections) {
  const ref = useRef(null)
  const scroll = useScroll()

  // Build cumulative page offsets from the sections array
  const pagesBefore = sections.slice(0, index).reduce((sum, s) => sum + (s.scrollPages ?? 1), 0)
  const myPages = sections[index].scrollPages ?? 1

  const start = pagesBefore / TOTAL_PAGES
  const end   = (pagesBefore + myPages) / TOTAL_PAGES

  // Fade window: 20% of the section's own span, but at least 0.04 and at most 0.12
  const rawFade = (end - start) * 0.20
  const fade = Math.min(Math.max(rawFade, 0.04), 0.12)

  const isLast = index === total - 1

  useFrame(() => {
    if (!ref.current) return
    const t = scroll.offset
    let visibility

    if (t < start - fade) {
      visibility = 0
    } else if (t < start) {
      visibility = (t - (start - fade)) / fade
    } else if (t <= end) {
      visibility = 1
    } else if (isLast) {
      // Last section stays fully visible — no fade-out at the scroll bottom
      visibility = 1
    } else if (t > end + fade) {
      visibility = 0
    } else {
      visibility = 1 - (t - end) / fade
    }

    ref.current.style.opacity = visibility.toFixed(3)
    ref.current.style.transform = `translateY(${((1 - visibility) * 24).toFixed(2)}px)`
  })

  return ref
}
