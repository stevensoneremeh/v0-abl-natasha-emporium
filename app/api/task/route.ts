import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // This endpoint is called by the daily cron job
    console.log("[CRON] Running daily maintenance task for ABL Natasha Enterprise")

    // Clean up expired guest sessions
    const { error: cleanupError } = await supabase
      .from("guest_sessions")
      .delete()
      .lt("expires_at", new Date().toISOString())

    if (cleanupError) {
      console.error("[CRON] Error cleaning up guest sessions:", cleanupError)
    } else {
      console.log("[CRON] Successfully cleaned up expired guest sessions")
    }

    // Update product stock status
    const { error: stockError } = await supabase
      .from("products")
      .update({ status: "out_of_stock" })
      .eq("stock_quantity", 0)
      .eq("status", "active")

    if (stockError) {
      console.error("[CRON] Error updating stock status:", stockError)
    } else {
      console.log("[CRON] Successfully updated product stock status")
    }

    return NextResponse.json({
      success: true,
      message: "Daily maintenance task completed successfully",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[CRON] Daily task error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Daily maintenance task failed",
      },
      { status: 500 },
    )
  }
}
