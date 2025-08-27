"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react"
import { PageLayout } from "@/components/page-layout"
import Image from "next/image"

export default function TestimonialsPage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Real Estate Investor",
      location: "Lagos, Nigeria",
      rating: 5,
      content:
        "ABL NATASHA ENTERPRISES helped me find the perfect investment property in Victoria Island. Their expertise and attention to detail made the entire process seamless. I couldn't be happier with my purchase.",
      image: "/testimonial-sarah.png",
      property: "Luxury Penthouse, Victoria Island",
    },
    {
      name: "Michael Chen",
      role: "Business Executive",
      location: "Abuja, Nigeria",
      rating: 5,
      content:
        "The level of service and quality of products is exceptional. From luxury watches to premium wines, everything I've purchased has exceeded my expectations. Their concierge service is truly world-class.",
      image: "/testimonial-michael.png",
      property: "Premium Product Collection",
    },
    {
      name: "Dr. Amara Okafor",
      role: "Medical Professional",
      location: "Port Harcourt, Nigeria",
      rating: 5,
      content:
        "I was looking for a luxury home for my family, and ABL NATASHA ENTERPRISES delivered beyond my dreams. The property management services they provide give me complete peace of mind.",
      image: "/testimonial-amara.png",
      property: "Family Estate, GRA",
    },
    {
      name: "James Williams",
      role: "Tech Entrepreneur",
      location: "London, UK",
      rating: 5,
      content:
        "As an international client, I was impressed by their professionalism and ability to handle complex transactions remotely. The white-glove delivery service ensured my purchases arrived in perfect condition.",
      image: "/testimonial-james.png",
      property: "International Purchase",
    },
    {
      name: "Fatima Al-Hassan",
      role: "Fashion Designer",
      location: "Dubai, UAE",
      rating: 5,
      content:
        "Their curated selection of luxury goods is unmatched. Every piece I've purchased has been authentic and of the highest quality. The personal shopping service saves me so much time.",
      image: "/testimonial-fatima.png",
      property: "Designer Collection",
    },
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <PageLayout>
      <div className="py-12">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <Badge className="bg-luxury-gold text-luxury-navy mb-4">Client Stories</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-luxury-navy font-playfair mb-6">What Our Clients Say</h1>
          <p className="text-xl text-luxury-charcoal max-w-3xl mx-auto">
            Discover why discerning clients choose ABL NATASHA ENTERPRISES for their luxury needs.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <Card className="card-luxury overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-96 lg:h-auto">
                  <Image
                    src={testimonials[currentTestimonial].image || "/placeholder.svg"}
                    alt={testimonials[currentTestimonial].name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <Quote className="h-12 w-12 text-luxury-gold mb-6" />
                  <blockquote className="text-xl text-luxury-charcoal mb-6 leading-relaxed">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  <div className="flex items-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-luxury-gold fill-current" />
                    ))}
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-luxury-navy">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-luxury-charcoal">{testimonials[currentTestimonial].role}</p>
                    <p className="text-sm text-luxury-charcoal">{testimonials[currentTestimonial].location}</p>
                    <Badge variant="outline" className="mt-2">
                      {testimonials[currentTestimonial].property}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={prevTestimonial}
                      className="rounded-full w-10 h-10 p-0 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-luxury-charcoal">
                      {currentTestimonial + 1} of {testimonials.length}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={nextTestimonial}
                      className="rounded-full w-10 h-10 p-0 bg-transparent"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All Testimonials Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <h2 className="text-3xl font-bold text-luxury-navy font-playfair text-center mb-12">More Client Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className={`card-luxury cursor-pointer transition-all duration-300 ${
                  index === currentTestimonial ? "ring-2 ring-luxury-gold" : "hover:shadow-lg"
                }`}
                onClick={() => setCurrentTestimonial(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-luxury-navy">{testimonial.name}</h3>
                      <p className="text-sm text-luxury-charcoal">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-luxury-gold fill-current" />
                    ))}
                  </div>

                  <p className="text-luxury-charcoal text-sm line-clamp-4 mb-4">"{testimonial.content}"</p>

                  <Badge variant="outline" className="text-xs">
                    {testimonial.property}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-luxury-cream py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-luxury-navy font-playfair mb-6">
              Ready to Join Our Satisfied Clients?
            </h2>
            <p className="text-xl text-luxury-charcoal mb-8">
              Experience the same exceptional service and quality that our clients rave about.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90">
                Start Your Journey
              </Button>
              <Button variant="outline" size="lg">
                Contact Us Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
