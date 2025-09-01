import { redirect } from "next/navigation"

export default function CategoriesRealEstatePage() {
  redirect("/real-estate")
}

export const dynamic = "force-dynamic"
