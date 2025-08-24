interface StructuredDataProps {
  type: "Product" | "BreadcrumbList" | "Organization" | "WebSite"
  data: any
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data,
    }

    switch (type) {
      case "Product":
        return {
          ...baseData,
          brand: {
            "@type": "Brand",
            name: data.brand || "ABL NATASHA ENTERPRISES",
          },
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: "USD",
            availability: data.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: {
              "@type": "Organization",
              name: "ABL NATASHA ENTERPRISES",
            },
          },
          aggregateRating: data.rating
            ? {
                "@type": "AggregateRating",
                ratingValue: data.rating,
                reviewCount: data.reviewCount || 1,
              }
            : undefined,
        }
      case "BreadcrumbList":
        return {
          ...baseData,
          itemListElement: data.items?.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        }
      default:
        return baseData
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(generateStructuredData()),
      }}
    />
  )
}
