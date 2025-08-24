import { type NextRequest, NextResponse } from "next/server"
import { getRealEstateProperties } from "@/lib/real-estate"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined
    const offset = searchParams.get("offset") ? Number.parseInt(searchParams.get("offset")!) : undefined
    const availableOnly = searchParams.get("availableOnly") === "true"

    const properties = await getRealEstateProperties({
      limit,
      offset,
      availableOnly,
    })

    return NextResponse.json(properties)
  } catch (error) {
    console.error("Error in real estate properties API:", error)
    return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 })
  }
}
