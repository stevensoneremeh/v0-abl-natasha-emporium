import { type NextRequest, NextResponse } from "next/server"
import { getRealEstatePropertyBySlug } from "@/lib/real-estate"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const property = await getRealEstatePropertyBySlug(params.slug)

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json(property)
  } catch (error) {
    console.error("Error in real estate property API:", error)
    return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 })
  }
}
