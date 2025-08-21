
'use client'
import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals'

export default function ClientVitals() {
  function send(metric: any) {
    try {
      navigator.sendBeacon('/api/rum', JSON.stringify(metric))
    } catch {
      fetch('/api/rum', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(metric) })
    }
  }
  onLCP(send); onFID(send); onCLS(send); onINP(send); onTTFB(send)
  return null
}
