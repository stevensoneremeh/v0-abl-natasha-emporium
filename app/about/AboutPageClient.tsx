"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Globe, Heart } from "lucide-react"
import Image from "next/image"

const stats = [
  { icon: Users, label: "Happy Customers", value: "10,000+" },
  { icon: Award, label: "Years of Excellence", value: "15+" },
  { icon: Globe, label: "Countries Served", value: "25+" },
  { icon: Heart, label: "Products Curated", value: "5,000+" },
]

const values = [
  {
    title: "Luxury & Quality",
    description: "We curate only the finest products from renowned brands and artisans worldwide.",
    icon: "💎",
  },
  {
    title: "Exceptional Service",
    description: "Our dedicated team provides personalized service to exceed your expectations.",
    icon: "⭐",
  },
  {
    title: "Trust & Authenticity",
    description: "Every product is guaranteed authentic with certificates of authenticity.",
    icon: "🛡️",
  },
  {
    title: "Global Reach",
    description: "From fashion to real estate, we connect you with luxury opportunities worldwide.",
    icon: "🌍",
  },
]

export default function AboutPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">About ABL NATASHA EMPORIUM</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Redefining Luxury Living
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              For over a decade, ABL NATASHA EMPORIUM has been the premier destination for discerning individuals
              seeking the finest in luxury fashion, beauty, real estate, and exclusive services. We don't just sell
              products – we curate experiences that elevate your lifestyle.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at ABL NATASHA EMPORIUM
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded with a vision to make luxury accessible to those who appreciate the finer things in life, ABL
                  NATASHA EMPORIUM began as a small boutique with big dreams. Our founder, Natasha, recognized a gap in
                  the market for authentic, high-quality luxury goods backed by exceptional service.
                </p>
                <p>
                  Today, we've grown into a global platform that connects discerning customers with the world's most
                  coveted brands and exclusive opportunities. From rare vintage wines to prime real estate, from haute
                  couture to bespoke services – we curate experiences that define luxury living.
                </p>
                <p>
                  Our commitment to authenticity, quality, and customer satisfaction has earned us the trust of
                  thousands of customers worldwide. We're not just a marketplace; we're your partners in creating a
                  lifestyle that reflects your success and sophistication.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                <Image
                  src="/luxury-boutique-interior.jpg"
                  alt="ABL NATASHA EMPORIUM Boutique"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
