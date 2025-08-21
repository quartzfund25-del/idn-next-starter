
import type { Article } from '@/lib/data'

export function getRelated(all: Article[], current: Article, max = 4): Article[] {
  const has = (xs: string[]) => xs.map(x => x.toLowerCase())
  const ct = has(current.tags)
  const sameCat = all.filter(a => a.category === current.category && a.slug !== current.slug)
  const scored = sameCat.map(a => {
    const t = has(a.tags).filter(t => ct.includes(t)).length
    const score = t * 2 + (a.category === current.category ? 1 : 0)
    return { a, score }
  }).sort((x, y) => y.score - x.score || 0)
  return scored.slice(0, max).map(s => s.a)
}
