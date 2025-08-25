import { type NextRequest, NextResponse } from "next/server"
import { getRealEstatePropertyBySlug } from "@/lib/real-estate"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    console.log("[v0] Fetching real estate property for slug:", params.slug)

    const property = await getRealEstatePropertyBySlug(params.slug)

    if (!property) {
      console.log("[v0] Property not found for slug:", params.slug)
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    console.log("[v0] Successfully fetched property:", property.id)
    return NextResponse.json(property)
  } catch (error) {
    console.error("[v0] Error in real estate property API:", error)
    return NextResponse.json(
      { error: "Failed to fetch property", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
