import type { Metadata } from "next"
import ProductsClientPage from "./ProductsClientPage"

export const metadata: Metadata = {
  title: "Products - ABL NATASHA ENTERPRISES",
  description: "Browse our complete collection of luxury products and premium items.",
}

export default function ProductsPage() {
  return <ProductsClientPage />
}
