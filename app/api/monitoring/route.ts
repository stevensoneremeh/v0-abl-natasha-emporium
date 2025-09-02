import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Basic health check
    const healthCheck = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || "1.0.0",
    }

    return NextResponse.json(healthCheck, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    // Log different types of monitoring data
    switch (type) {
      case "error":
        console.error("Client error:", data)
        break
      case "performance":
        console.log("Performance metric:", data)
        break
      case "user_action":
        console.log("User action:", data)
        break
      default:
        console.log("Monitoring data:", { type, data })
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === "production") {
      // Add your monitoring service integration here
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Monitoring endpoint error:", error)
    return NextResponse.json({ error: "Failed to process monitoring data" }, { status: 500 })
  }
}
