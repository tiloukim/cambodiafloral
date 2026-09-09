'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/tracking'

/** Records the first-touch source once per visitor. Renders nothing. */
export default function AttributionTracker() {
  useEffect(() => { captureAttribution() }, [])
  return null
}
