"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)

    // Log to analytics service in production
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      // Add your error tracking service here (e.g., Sentry, LogRocket)
      console.error("Production error:", { error, errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Something went wrong</h1>

              <p className="text-slate-600 dark:text-slate-300 mb-8">
                We apologize for the inconvenience. Our team has been notified and is working to fix this issue.
              </p>

              <div className="space-y-4">
                <Button
                  onClick={() => this.setState({ hasError: false })}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>

                <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                  Go Home
                </Button>
              </div>

              {typeof window !== "undefined" && window.location.hostname === "localhost" && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-slate-100 dark:bg-slate-700 p-4 rounded overflow-auto">
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
