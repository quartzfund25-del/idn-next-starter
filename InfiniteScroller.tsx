
'use client'
import { useEffect, useRef } from 'react'

export default function InfiniteScroller({ onLoadMore }: { onLoadMore: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) onLoadMore()
      })
    }, { rootMargin: '100px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [onLoadMore])
  return <div ref={ref} className="py-6 text-center text-sm text-gray-500">Memuat...</div>
}
