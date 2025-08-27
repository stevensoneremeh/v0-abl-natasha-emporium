let createBrowserClient: any

try {
  const supabaseSSR = require("@supabase/ssr")
  createBrowserClient = supabaseSSR.createBrowserClient
} catch (error) {
  console.warn("@supabase/ssr package not found, using fallback client")
  createBrowserClient = null
}

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

// Create browser client for client components
export const createClient = () => {
  if (!isSupabaseConfigured || !createBrowserClient) {
    console.warn("Supabase not configured or package missing. Using dummy client.")
    return {
      from: () => ({
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
          order: () => Promise.resolve({ data: [], error: null }),
          limit: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null }),
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: () => Promise.resolve({ data: null, error: null }),
        signUp: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: null }),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
        }),
      },
    }
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Create a singleton instance for client components
export const supabase = createClient()

// Helper for browser usage
export const createBrowserSupabaseClient = createClient
