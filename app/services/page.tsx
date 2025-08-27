import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Home, ShoppingBag, Truck, Shield, Users, Star, ArrowRight } from "lucide-react"
import { PageLayout } from "@/components/page-layout"
import Link from "next/link"
import Image from "next/image"

export const metadata = {
  title: "Our Services - ABL NATASHA ENTERPRISES",
  description:
    "Discover our comprehensive range of luxury services including real estate, premium products, and personalized solutions.",
}

export default function ServicesPage() {
  const services = [
    {
      title: "Luxury Real Estate",
      description: "Premium properties in prime locations with full-service support from acquisition to management.",
      icon: Home,
      features: ["Property Acquisition", "Investment Consulting", "Property Management", "Market Analysis"],
      image: "/luxury-real-estate-service.png",
      href: "/real-estate",
    },
    {
      title: "Premium Products",
      description: "Curated selection of luxury goods including wines, fashion, electronics, and lifestyle products.",
      icon: ShoppingBag,
      features: ["Curated Selection", "Authenticity Guarantee", "Personal Shopping", "Exclusive Access"],
      image: "/premium-products-service.png",
      href: "/products",
    },
    {
      title: "Concierge Services",
      description: "Personalized assistance for all your luxury lifestyle needs and exclusive experiences.",
      icon: Users,
      features: ["Personal Assistant", "Event Planning", "Travel Arrangements", "Exclusive Access"],
      image: "/concierge-service.png",
      href: "/contact",
    },
    {
      title: "White Glove Delivery",
      description: "Premium delivery and installation services ensuring your purchases arrive in perfect condition.",
      icon: Truck,
      features: ["Secure Transport", "Professional Installation", "Insurance Coverage", "Flexible Scheduling"],
      image: "/delivery-service.png",
      href: "/contact",
    },
  ]

  return (
    <PageLayout>
      <div className="py-12">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <Badge className="bg-luxury-gold text-luxury-navy mb-4">Premium Services</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-luxury-navy font-playfair mb-6">
            Exceptional Services for Discerning Clients
          </h1>
          <p className="text-xl text-luxury-charcoal max-w-3xl mx-auto">
            Experience unparalleled luxury with our comprehensive range of premium services, tailored to meet the
            highest standards of excellence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="card-luxury overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                  <div className="absolute top-4 left-4">
                    <div className="w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-luxury-navy" />
                    </div>
                  </div>
                </div>
                <CardContent className="p-8">
                  <CardTitle className="text-2xl font-bold text-luxury-navy mb-4">{service.title}</CardTitle>
                  <p className="text-luxury-charcoal mb-6">{service.description}</p>

                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-luxury-gold" />
                        <span className="text-luxury-charcoal">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button asChild className="w-full bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90">
                    <Link href={service.href}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-luxury-cream py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy font-playfair mb-4">
                Why Choose ABL NATASHA ENTERPRISES
              </h2>
              <p className="text-xl text-luxury-charcoal max-w-3xl mx-auto">
                We set the standard for luxury service with our commitment to excellence and attention to detail.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">Trusted Excellence</h3>
                <p className="text-luxury-charcoal">
                  Years of experience delivering exceptional results with unwavering commitment to quality and
                  integrity.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">Personalized Service</h3>
                <p className="text-luxury-charcoal">
                  Tailored solutions that understand and exceed your unique requirements and expectations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-luxury-navy" />
                </div>
                <h3 className="text-xl font-bold text-luxury-navy mb-2">Premium Quality</h3>
                <p className="text-luxury-charcoal">
                  Only the finest products and services that meet our rigorous standards for luxury and excellence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy font-playfair mb-6">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-luxury-charcoal mb-8 max-w-2xl mx-auto">
            Contact our team today to discuss how we can serve your luxury lifestyle needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90">
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn About Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
