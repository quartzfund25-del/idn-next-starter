
import 'server-only'

import { slugify } from '@/lib/utils'
import type { Article } from '@/lib/data'

type Provider = 'local' | 'strapi' | 'wp' | 'sanity'

const PROVIDER = (process.env.CMS_PROVIDER as Provider) || 'local'

export async function cmsGetAll(): Promise<Article[]> {
  switch (PROVIDER) {
    case 'strapi': return strapiGetAll()
    case 'wp':     return wpGetAll()
    case 'sanity': return sanityGetAll()
    default:       return (await import('@/lib/data')).then(m => m.getAllArticles())
  }
}

export async function cmsGetBySlug(slug: string): Promise<Article | null> {
  switch (PROVIDER) {
    case 'strapi': return strapiGetBySlug(slug)
    case 'wp':     return wpGetBySlug(slug)
    case 'sanity': return sanityGetBySlug(slug)
    default:       return (await import('@/lib/data')).then(m => m.getArticleBySlug(slug))
  }
}

export async function cmsGetByCategory(category: string): Promise<Article[]> {
  switch (PROVIDER) {
    case 'strapi': return strapiGetByCategory(category)
    case 'wp':     return wpGetByCategory(category)
    case 'sanity': return sanityGetByCategory(category)
    default:       return (await import('@/lib/data')).then(m => m.getByCategory(category))
  }
}

/** ---------------- STRAPI ---------------- */
async function strapiGetAll(): Promise<Article[]> {
  const url = `${process.env.STRAPI_URL}/api/articles?populate=*&pagination[pageSize]=50`
  const res = await fetch(url, { headers: authHeader(), next: { revalidate: 300 } })
  const json = await res.json()
  return (json.data || []).map(mapStrapi)
}
async function strapiGetBySlug(slug: string): Promise<Article|null> {
  const url = `${process.env.STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`
  const res = await fetch(url, { headers: authHeader(), next: { revalidate: 300 } })
  const json = await res.json()
  const item = (json.data || [])[0]
  return item ? mapStrapi(item) : null
}
async function strapiGetByCategory(cat: string): Promise<Article[]> {
  const url = `${process.env.STRAPI_URL}/api/articles?filters[category][$eq]=${encodeURIComponent(cat)}&populate=*`
  const res = await fetch(url, { headers: authHeader(), next: { revalidate: 300 } })
  const json = await res.json()
  return (json.data || []).map(mapStrapi)
}
function authHeader() {
  return process.env.STRAPI_TOKEN ? { Authorization: `Bearer ${process.env.STRAPI_TOKEN}` } : {}
}
function mapStrapi(item: any): Article {
  const a = item.attributes
  return {
    id: item.id,
    title: a.title,
    slug: a.slug || slugify(a.title),
    excerpt: a.excerpt || '',
    content: a.content || '',
    image: a.image?.data?.attributes?.url || a.cover?.url || '',
    category: a.category || 'News',
    author: a.author || 'Redaksi',
    publishedAt: a.publishedAt || a.createdAt,
    tags: a.tags || [],
    views: a.views || 0,
  }
}

/** ---------------- WORDPRESS ---------------- */
async function wpGetAll(): Promise<Article[]> {
  const base = process.env.WP_URL
  const res = await fetch(`${base}/wp-json/wp/v2/posts?_embed&per_page=50`, { next: { revalidate: 300 } })
  const arr = await res.json()
  return arr.map(mapWP)
}
async function wpGetBySlug(slug: string): Promise<Article|null> {
  const base = process.env.WP_URL
  const res = await fetch(`${base}/wp-json/wp/v2/posts?_embed&slug=${slug}`, { next: { revalidate: 300 } })
  const arr = await res.json()
  return arr[0] ? mapWP(arr[0]) : null
}
async function wpGetByCategory(cat: string): Promise<Article[]> {
  // WordPress typically filters by category ID; here we fetch all and filter client-side by name
  const all = await wpGetAll()
  return all.filter(a => a.category.toLowerCase() === cat.toLowerCase())
}
function mapWP(p: any): Article {
  const media = p._embedded && p._embedded['wp:featuredmedia'] && p._embedded['wp:featuredmedia'][0]
  const image = media?.source_url || ''
  const cats = p._embedded && p._embedded['wp:term'] && p._embedded['wp:term'][0]
  const catName = cats && cats[0] ? cats[0].name : 'News'
  return {
    id: p.id,
    title: decode(p.title?.rendered || ''),
    slug: p.slug,
    excerpt: stripHtml(p.excerpt?.rendered || ''),
    content: p.content?.rendered || '',
    image,
    category: catName,
    author: 'Redaksi',
    publishedAt: p.date_gmt || p.date,
    tags: [],
    views: 0
  }
}
function decode(s: string){ return s.replace(/&#(\d+);/g, (_,n)=>String.fromCharCode(parseInt(n,10))) }
function stripHtml(s: string){ return s.replace(/<[^>]*>/g,'') }

/** ---------------- SANITY ---------------- */
async function sanityGetAll(): Promise<Article[]> {
  const pid = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const q = encodeURIComponent('*[_type=="article"] | order(publishedAt desc)[0..49]{..., "image": cover.asset->url}')
  const url = `https://${pid}.api.sanity.io/v1/data/query/${dataset}?query=${q}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  return (json.result || []).map(mapSanity)
}
async function sanityGetBySlug(slug: string): Promise<Article|null> {
  const pid = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const q = encodeURIComponent('*[_type=="article" && slug.current==$slug][0]{..., "image": cover.asset->url}')
  const url = `https://${pid}.api.sanity.io/v1/data/query/${dataset}?query=${q}&%24slug=${encodeURIComponent(slug)}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  const item = json.result
  return item ? mapSanity(item) : null
}
async function sanityGetByCategory(cat: string): Promise<Article[]> {
  const pid = process.env.SANITY_PROJECT_ID
  const dataset = process.env.SANITY_DATASET || 'production'
  const q = encodeURIComponent('*[_type=="article" && category==$cat]{..., "image": cover.asset->url}')
  const url = `https://${pid}.api.sanity.io/v1/data/query/${dataset}?query=${q}&%24cat=${encodeURIComponent(cat)}`
  const res = await fetch(url, { next: { revalidate: 300 } })
  const json = await res.json()
  return (json.result || []).map(mapSanity)
}
function mapSanity(a: any): Article {
  return {
    id: a._id?.length || Math.random(),
    title: a.title,
    slug: a.slug?.current || slugify(a.title),
    excerpt: a.excerpt || '',
    content: a.contentHtml || a.content || '',
    image: a.image || '',
    category: a.category || 'News',
    author: a.author || 'Redaksi',
    publishedAt: a.publishedAt || a._createdAt,
    tags: a.tags || [],
    views: 0
  }
}
