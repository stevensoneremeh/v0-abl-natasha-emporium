"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-luxury-cream flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="card-luxury">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
              </motion.div>
              <CardTitle className="font-playfair text-2xl text-luxury-navy">Access Denied</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-luxury-charcoal">You don't have permission to access the admin panel.</p>
                <p className="text-sm text-luxury-charcoal/70">Only authorized administrators can access this area.</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full btn-luxury" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Homepage
                  </Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/dashboard">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>

              <div className="text-xs text-luxury-charcoal/60 pt-4 border-t">
                If you believe this is an error, please contact support.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
