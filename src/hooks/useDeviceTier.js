import { useState } from 'react'

// Same spirit as bruno-simon.com's own two-tier quality system (mobile UA
// check -> level 0/1, broadcast to shadow/bloom/particle settings) — combined
// with a couple more signals since UA alone misses e.g. low-core desktops.
// `navigator.deviceMemory` is Chrome/Android-only; treated as one signal
// among several, never the sole check.
function detectTier() {
  if (typeof window === 'undefined') return 'high'

  const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches
  const isSmallViewport = window.matchMedia?.('(max-width: 768px)').matches
  const mobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const fewCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false
  const lowMemory = navigator.deviceMemory ? navigator.deviceMemory <= 4 : false

  const isLow = (isCoarsePointer && isSmallViewport) || mobileUA || fewCores || lowMemory
  return isLow ? 'low' : 'high'
}

export function useDeviceTier() {
  // Lazy initializer runs once on mount — this is a pure CSR app (no SSR/
  // hydration to worry about), so there's no need for the extra effect+render
  // pass just to defer a window/navigator read.
  const [tier] = useState(() => detectTier())
  return tier
}
