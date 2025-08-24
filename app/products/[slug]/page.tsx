import { getProductBySlug } from "@/lib/database-client"
import ProductClientPage from "./ProductClientPage"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - ABL NATASHA EMPORIUM`,
    description: product.meta_description || product.short_description || product.description,
  }
}

export default function ProductPage(props: ProductPageProps) {
  return <ProductClientPage {...props} />
}
