
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cmsGetByCategory } from '@/lib/cms'
import ArticleCard from '@/components/ArticleCard'

type Props = { params: { category: string } }

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const name = decodeURIComponent(params.category)
  return {
    title: `Kategori: ${name}`,
    description: `Artikel dalam kategori ${name}`
  }
}

export default async function CategoryPage({ params }: Props) {
  const name = decodeURIComponent(params.category)
  const list = await cmsGetByCategory(name)
  if (!list.length) return notFound()

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-4">Kategori: {name}</h1>
      <div className="grid gap-5 md:grid-cols-3">
        {list.map(a => <ArticleCard key={a.slug} a={a} />)}
      </div>
    </div>
  )
}
