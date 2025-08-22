import type { Metadata } from "next"
import CategoriesClientPage from "./CategoriesClientPage"

export const metadata: Metadata = {
  title: "Categories - ABL NATASHA EMPORIUM",
  description: "Browse our luxury categories including fashion, beauty, real estate, and more.",
}

export default function CategoriesPage() {
  return <CategoriesClientPage />
}
