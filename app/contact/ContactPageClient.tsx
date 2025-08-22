"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from "lucide-react"

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Showroom",
    details: ["Victoria Island, Lagos", "Nigeria"],
    action: "Get Directions",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+234 (0) 123 456 7890", "+234 (0) 987 654 3210"],
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@ablnatasha.com", "support@ablnatasha.com"],
    action: "Send Email",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 7:00 PM", "Sat - Sun: 10:00 AM - 6:00 PM"],
    action: "View Calendar",
  },
]

export default function ContactPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Contact Us</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground">
              Have questions about our luxury products or services? Our dedicated team is here to assist you with
              personalized recommendations and exceptional support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm group">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                      <info.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                    <div className="space-y-1 text-muted-foreground mb-4">
                      {info.details.map((detail, i) => (
                        <p key={i}>{detail}</p>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary hover:text-primary-foreground bg-transparent"
                    >
                      {info.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="border-0 shadow-xl bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone (Optional)</label>
                    <Input type="tel" placeholder="+234 (0) 123 456 7890" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea placeholder="Tell us about your inquiry..." rows={6} />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">Why Choose ABL NATASHA EMPORIUM?</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Personalized Service</h4>
                      <p className="text-muted-foreground">
                        Our luxury consultants provide tailored recommendations based on your preferences.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Authentic Products</h4>
                      <p className="text-muted-foreground">
                        Every item comes with a certificate of authenticity and our quality guarantee.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">Global Shipping</h4>
                      <p className="text-muted-foreground">Secure, insured delivery to over 25 countries worldwide.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">24/7 Support</h4>
                      <p className="text-muted-foreground">
                        Our customer service team is available around the clock to assist you.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-lg mb-2">Prefer to Talk?</h4>
                  <p className="text-muted-foreground mb-4">
                    Schedule a consultation with one of our luxury specialists for personalized assistance.
                  </p>
                  <Button variant="outline" className="hover:bg-primary hover:text-primary-foreground bg-transparent">
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
