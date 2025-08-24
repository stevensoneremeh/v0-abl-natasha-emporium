import { type NextRequest, NextResponse } from "next/server"
import { getProductsByCategory } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { categoryId: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined
    const sortBy = searchParams.get("sortBy") as "name" | "price" | "created_at" | undefined
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | undefined
    const featured = searchParams.get("featured") ? searchParams.get("featured") === "true" : undefined

    const products = await getProductsByCategory(params.categoryId, {
      limit,
      offset,
      sortBy,
      sortOrder,
      featured,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
