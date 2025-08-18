export function safeMetadataBase(url?: string): URL {
  try {
    if (url && url.length > 0) {
      return new URL(url)
    }
    throw new Error("No URL provided")
  } catch {
    return new URL("https://abl-natasha-emporium.vercel.app")
  }
}
