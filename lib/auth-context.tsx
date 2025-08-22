"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  guestId: string | null
  isAuthenticated: boolean
  isGuest: boolean
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [guestId, setGuestId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)

      if (!session?.user) {
        let storedGuestId = localStorage.getItem("guest_id")
        if (!storedGuestId) {
          storedGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          localStorage.setItem("guest_id", storedGuestId)
        }
        setGuestId(storedGuestId)
      }

      setLoading(false)
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        setGuestId(null)
        localStorage.removeItem("guest_id")
      } else {
        const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        setGuestId(newGuestId)
        localStorage.setItem("guest_id", newGuestId)
      }

      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    guestId,
    isAuthenticated: !!user,
    isGuest: !user && !!guestId,
    loading,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
