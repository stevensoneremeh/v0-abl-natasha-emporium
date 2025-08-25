"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, Star, MessageSquare, Megaphone, Video, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface FeaturedProduct {
  id: string
  name: string
  price: number
  image: string
  category: string
  is_featured: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
  image: string
  is_active: boolean
}

interface AnnouncementBanner {
  id: string
  content: string
  is_active: boolean
  background_color: string
  text_color: string
}

interface HeroSection {
  id: string
  title: string
  subtitle: string
  video_url: string
  poster_image: string
  primary_cta_text: string
  primary_cta_link: string
  secondary_cta_text: string
  secondary_cta_link: string
  is_active: boolean
}

export default function AdminHomepagePage() {
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [announcement, setAnnouncement] = useState<AnnouncementBanner | null>(null)
  const [heroSection, setHeroSection] = useState<HeroSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadHomepageData()
  }, [])

  const loadHomepageData = async () => {
    try {
      setIsLoading(true)

      // Load featured products
      const productsResponse = await fetch("/api/admin/homepage/featured-products")
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setFeaturedProducts(productsData.products || [])
      }

      // Load testimonials
      const testimonialsResponse = await fetch("/api/admin/homepage/testimonials")
      if (testimonialsResponse.ok) {
        const testimonialsData = await testimonialsResponse.json()
        setTestimonials(testimonialsData.testimonials || [])
      }

      // Load announcement
      const announcementResponse = await fetch("/api/admin/homepage/announcement")
      if (announcementResponse.ok) {
        const announcementData = await announcementResponse.json()
        setAnnouncement(announcementData.announcement)
      }

      // Load hero section
      const heroResponse = await fetch("/api/admin/homepage/hero")
      if (heroResponse.ok) {
        const heroData = await heroResponse.json()
        setHeroSection(heroData.hero)
      }
    } catch (error) {
      console.error("Error loading homepage data:", error)
      toast({
        title: "Error",
        description: "Failed to load homepage data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProductFeatured = async (productId: string, featured: boolean) => {
    try {
      const response = await fetch("/api/admin/homepage/featured-products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, featured }),
      })

      if (response.ok) {
        setFeaturedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, is_featured: featured } : p)))
        toast({
          title: "Success",
          description: `Product ${featured ? "featured" : "unfeatured"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      })
    }
  }

  const updateAnnouncement = async () => {
    if (!announcement) return

    try {
      const response = await fetch("/api/admin/homepage/announcement", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(announcement),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Announcement updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update announcement",
        variant: "destructive",
      })
    }
  }

  const updateHeroSection = async () => {
    if (!heroSection) return

    try {
      const response = await fetch("/api/admin/homepage/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(heroSection),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Hero section updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hero section",
        variant: "destructive",
      })
    }
  }

  const toggleTestimonial = async (testimonialId: string, active: boolean) => {
    try {
      const response = await fetch("/api/admin/homepage/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId, active }),
      })

      if (response.ok) {
        setTestimonials((prev) => prev.map((t) => (t.id === testimonialId ? { ...t, is_active: active } : t)))
        toast({
          title: "Success",
          description: `Testimonial ${active ? "activated" : "deactivated"} successfully`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update testimonial",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading homepage management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Homepage Management</h1>
          <p className="text-muted-foreground">Manage featured content and homepage sections</p>
        </div>
        <Button onClick={loadHomepageData} variant="outline">
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Hero Section
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Featured Products
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
          <TabsTrigger value="announcement" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Announcement
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroSection && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Title</Label>
                      <Input
                        id="hero-title"
                        value={heroSection.title}
                        onChange={(e) => setHeroSection((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-video">Video URL</Label>
                      <Input
                        id="hero-video"
                        value={heroSection.video_url}
                        onChange={(e) =>
                          setHeroSection((prev) => (prev ? { ...prev, video_url: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={heroSection.subtitle}
                      onChange={(e) => setHeroSection((prev) => (prev ? { ...prev, subtitle: e.target.value } : null))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-cta-text">Primary CTA Text</Label>
                      <Input
                        id="primary-cta-text"
                        value={heroSection.primary_cta_text}
                        onChange={(e) =>
                          setHeroSection((prev) => (prev ? { ...prev, primary_cta_text: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primary-cta-link">Primary CTA Link</Label>
                      <Input
                        id="primary-cta-link"
                        value={heroSection.primary_cta_link}
                        onChange={(e) =>
                          setHeroSection((prev) => (prev ? { ...prev, primary_cta_link: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="hero-active"
                      checked={heroSection.is_active}
                      onCheckedChange={(checked) =>
                        setHeroSection((prev) => (prev ? { ...prev, is_active: checked } : null))
                      }
                    />
                    <Label htmlFor="hero-active">Active</Label>
                  </div>

                  <Button onClick={updateHeroSection} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Update Hero Section
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="relative h-32">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className={`absolute top-2 right-2 ${product.is_featured ? "bg-green-500" : "bg-gray-500"}`}
                      >
                        {product.is_featured ? "Featured" : "Not Featured"}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold line-clamp-2 mb-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                      <p className="font-bold mb-3">₦{product.price.toLocaleString()}</p>
                      <div className="flex items-center justify-between">
                        <Switch
                          checked={product.is_featured}
                          onCheckedChange={(checked) => toggleProductFeatured(product.id, checked)}
                        />
                        <span className="text-sm">
                          {product.is_featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Testimonials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Image
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{testimonial.name}</h4>
                              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={testimonial.is_active}
                                onCheckedChange={(checked) => toggleTestimonial(testimonial.id, checked)}
                              />
                              <Badge variant={testimonial.is_active ? "default" : "secondary"}>
                                {testimonial.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm mb-2">"{testimonial.content}"</p>
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcement Banner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcement && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="announcement-content">Announcement Content</Label>
                    <Textarea
                      id="announcement-content"
                      value={announcement.content}
                      onChange={(e) => setAnnouncement((prev) => (prev ? { ...prev, content: e.target.value } : null))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bg-color">Background Color</Label>
                      <Input
                        id="bg-color"
                        type="color"
                        value={announcement.background_color}
                        onChange={(e) =>
                          setAnnouncement((prev) => (prev ? { ...prev, background_color: e.target.value } : null))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="text-color">Text Color</Label>
                      <Input
                        id="text-color"
                        type="color"
                        value={announcement.text_color}
                        onChange={(e) =>
                          setAnnouncement((prev) => (prev ? { ...prev, text_color: e.target.value } : null))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="announcement-active"
                      checked={announcement.is_active}
                      onCheckedChange={(checked) =>
                        setAnnouncement((prev) => (prev ? { ...prev, is_active: checked } : null))
                      }
                    />
                    <Label htmlFor="announcement-active">Show Announcement</Label>
                  </div>

                  <Button onClick={updateAnnouncement} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Update Announcement
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Category management coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
