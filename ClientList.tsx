
'use client'
import { useMemo, useState, useCallback } from 'react'
import type { Article } from '@/lib/data'
import ArticleCard from '@/components/ArticleCard'
import InfiniteScroller from '@/components/InfiniteScroller'

export default function ClientList({ initial, all }: { initial: Article[], all: Article[] }) {
  const [count, setCount] = useState(initial.length)
  const list = useMemo(() => all.slice(0, count), [all, count])

  const onLoadMore = useCallback(() => {
    setCount(c => Math.min(all.length, c + 9))
  }, [all.length])

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-3">
        {list.map((a, idx) => (
          <ArticleCard key={a.slug} a={a} horizontal={idx % 3 === 0} />
        ))}
      </div>
      {count < all.length && <InfiniteScroller onLoadMore={onLoadMore} />}
    </div>
  )
}
