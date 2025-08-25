import { getCategoryBySlug, getProductsByCategory } from "@/lib/database-client"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import CategoryClientPage from "./CategoryClientPage"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
    sort?: string
    view?: "grid" | "list"
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - ABL NATASHA ENTERPRISES`,
    description: category.description || `Browse our collection of ${category.name.toLowerCase()} products`,
  }
}

async function CategoryContent({ params, searchParams }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const allProducts = await getProductsByCategory(category.id)

  return <CategoryClientPage category={category} allProducts={allProducts} searchParams={searchParams} />
}

export default function CategoryPage(props: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-luxury-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-luxury-charcoal">Loading products...</p>
          </div>
        </div>
      }
    >
      <CategoryContent {...props} />
    </Suspense>
  )
}
