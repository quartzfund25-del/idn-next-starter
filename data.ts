
import { slugify } from '@/lib/utils'

export type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  publishedAt: string
  tags: string[]
  views: number
}

export const CATEGORIES = [
  'News','Hiburan','Teknologi','Bisnis','Olahraga','Gaya Hidup','Food','Travel','Otomotif'
] as const

const titles = [
  'Rangkuman Berita Terbaru Hari Ini: Fakta & Analisis Singkat',
  'Tips Produktif: 7 Kebiasaan Kecil yang Efeknya Besar',
  'Review Gadget: Worth It atau Skip?',
  'Ekonomi RI: Apa Arti Suku Bunga Turun?',
  'Startup Lokal Raih Pendanaan Baru, Ini Dampaknya',
  'Timnas Menang Tipis di Laga Persahabatan',
]

export const articles: Article[] = Array.from({ length: 18 }).map((_, i) => ({ 
  id: i+1,
  title: titles[i % titles.length],
  slug: slugify(titles[i % titles.length]) + '-' + (i+1),
  excerpt: 'Ringkasan cepat, padat, dan ramah pembaca. Klik untuk membaca versi lengkapnya.',
  content: `## Subjudul

Ini adalah konten contoh. Tuliskan paragraf artikel Anda di sini.

- Poin penting 1
- Poin penting 2

> Kutipan singkat yang mendukung.

### Penutup

Bagikan artikel ini bila bermanfaat.`,
  image: `https://images.unsplash.com/photo-15${10 + i}0${(i % 9) + 10}0-0${(i % 9) + 1}0?auto=format&fit=crop&w=1400&q=60`,
  category: CATEGORIES[i % CATEGORIES.length] as string,
  author: ['Asep F.','Sinta R.','Dimas A.','Lia P.'][i % 4],
  publishedAt: new Date(Date.now() - i * 3600_000).toISOString(),
  tags: ['trending','nasional','quickread','opini'].slice(0, (i % 4) + 1),
  views: 1000 + i * 133
}))

export function getAllArticles() { return articles }
export function getArticleBySlug(slug: string) { return articles.find(a => a.slug === slug) || null }
export function getByCategory(cat: string) { return articles.filter(a => a.category.toLowerCase() === cat.toLowerCase()) }
