import { createBrowserClient } from "@supabase/ssr"

// Check if Supabase environment variables are available
export const isSupabaseConfigured =
  typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
  typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0

const createMockQueryBuilder = () => {
  const mockResult = Promise.resolve({ data: [], error: null })

  const queryBuilder = {
    select: (columns?: string) => queryBuilder,
    eq: (column: string, value: any) => queryBuilder,
    neq: (column: string, value: any) => queryBuilder,
    gt: (column: string, value: any) => queryBuilder,
    gte: (column: string, value: any) => queryBuilder,
    lt: (column: string, value: any) => queryBuilder,
    lte: (column: string, value: any) => queryBuilder,
    like: (column: string, pattern: string) => queryBuilder,
    ilike: (column: string, pattern: string) => queryBuilder,
    is: (column: string, value: any) => queryBuilder,
    in: (column: string, values: any[]) => queryBuilder,
    contains: (column: string, value: any) => queryBuilder,
    containedBy: (column: string, value: any) => queryBuilder,
    rangeGt: (column: string, range: string) => queryBuilder,
    rangeGte: (column: string, range: string) => queryBuilder,
    rangeLt: (column: string, range: string) => queryBuilder,
    rangeLte: (column: string, range: string) => queryBuilder,
    rangeAdjacent: (column: string, range: string) => queryBuilder,
    overlaps: (column: string, value: any) => queryBuilder,
    textSearch: (column: string, query: string) => queryBuilder,
    match: (query: Record<string, any>) => queryBuilder,
    not: (column: string, operator: string, value: any) => queryBuilder,
    or: (filters: string) => queryBuilder,
    filter: (column: string, operator: string, value: any) => queryBuilder,
    order: (column: string, options?: { ascending?: boolean }) => queryBuilder,
    limit: (count: number) => queryBuilder,
    range: (from: number, to: number) => queryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    csv: () => Promise.resolve({ data: "", error: null }),
    geojson: () => Promise.resolve({ data: null, error: null }),
    explain: () => Promise.resolve({ data: "", error: null }),
    rollback: () => queryBuilder,
    returns: () => queryBuilder,
    then: (onfulfilled?: any, onrejected?: any) => mockResult.then(onfulfilled, onrejected),
    catch: (onrejected?: any) => mockResult.catch(onrejected),
    finally: (onfinally?: any) => mockResult.finally(onfinally),
  }

  return queryBuilder
}

// Create browser client for client components
export const createClient = () => {
  if (!isSupabaseConfigured) {
    return {
      from: (table: string) => ({
        select: (columns?: string) => createMockQueryBuilder(),
        insert: (values: any) => Promise.resolve({ data: null, error: null }),
        update: (values: any) => createMockQueryBuilder(),
        delete: () => createMockQueryBuilder(),
        upsert: (values: any) => Promise.resolve({ data: null, error: null }),
      }),
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        signInWithPassword: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signUp: (credentials: any) => Promise.resolve({ data: { user: null, session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        onAuthStateChange: (callback: any) => ({
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        }),
      },
      storage: {
        from: (bucket: string) => ({
          upload: (path: string, file: any) => Promise.resolve({ data: null, error: null }),
          getPublicUrl: (path: string) => ({ data: { publicUrl: "" } }),
          download: (path: string) => Promise.resolve({ data: null, error: null }),
          remove: (paths: string[]) => Promise.resolve({ data: null, error: null }),
          list: (path?: string) => Promise.resolve({ data: [], error: null }),
        }),
      },
      rpc: (fn: string, args?: any) => Promise.resolve({ data: null, error: null }),
    }
  }

  try {
    return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  } catch (error) {
    console.warn("Failed to create Supabase client, using dummy client:", error)
    return createClient() // Return dummy client on error
  }
}

// Create a singleton instance for client components
export const supabase = createClient()

// Helper for browser usage
export const createBrowserSupabaseClient = createClient
