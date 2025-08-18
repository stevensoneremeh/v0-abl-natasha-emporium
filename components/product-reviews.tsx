"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown, User, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Review {
  id: string
  user: {
    name: string
    avatar?: string
    verified: boolean
  }
  rating: number
  title: string
  content: string
  date: string
  helpful: number
  notHelpful: number
  images?: string[]
}

interface ProductReviewsProps {
  reviews: Review[]
  averageRating: number
  totalReviews: number
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "Adebayo Johnson",
      avatar: "/professional-man-headshot.png",
      verified: true,
    },
    rating: 5,
    title: "Exceptional Quality and Service",
    content:
      "This product exceeded my expectations in every way. The craftsmanship is outstanding and the attention to detail is remarkable. Delivery was prompt and packaging was luxurious.",
    date: "2024-01-15",
    helpful: 12,
    notHelpful: 1,
  },
  {
    id: "2",
    user: {
      name: "Chioma Okafor",
      avatar: "/professional-woman-headshot.png",
      verified: true,
    },
    rating: 5,
    title: "Worth Every Naira",
    content:
      "Initially hesitant about the price, but after receiving the product, I can confidently say it's worth every naira. The luxury feel and premium materials justify the cost.",
    date: "2024-01-10",
    helpful: 8,
    notHelpful: 0,
  },
  {
    id: "3",
    user: {
      name: "Michael Adeyemi",
      avatar: "/luxury-man-headshot.png",
      verified: false,
    },
    rating: 4,
    title: "Great Product, Minor Issues",
    content:
      "Overall very satisfied with the purchase. The product quality is excellent, though delivery took slightly longer than expected. Customer service was responsive and helpful.",
    date: "2024-01-05",
    helpful: 5,
    notHelpful: 2,
  },
]

export function ProductReviews({ reviews = mockReviews, averageRating = 4.8, totalReviews = 24 }: ProductReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating">("newest")

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      distribution[review.rating - 1]++
    })
    return distribution.reverse()
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Overall Rating */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <span className="text-5xl font-bold text-luxury-navy">{averageRating}</span>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "fill-luxury-gold text-luxury-gold" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-luxury-charcoal">Based on {totalReviews} reviews</p>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map((count, index) => {
            const rating = 5 - index
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            return (
              <div key={rating} className="flex items-center gap-2">
                <span className="text-sm text-luxury-charcoal w-8">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-luxury-gold h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  />
                </div>
                <span className="text-sm text-luxury-charcoal w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Sort Controls */}
      <div className="flex items-center justify-between">
        <h3 className="font-playfair text-2xl font-bold text-luxury-navy">Customer Reviews</h3>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "rating")}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-luxury-gold focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <AnimatePresence>
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                      <AvatarFallback>
                        <User className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-luxury-navy">{review.user.name}</h4>
                        {review.user.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Verified Purchase</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? "fill-luxury-gold text-luxury-gold" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-luxury-charcoal">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <h5 className="font-semibold text-luxury-navy mb-2">{review.title}</h5>
                      <p className="text-luxury-charcoal mb-4">{review.content}</p>

                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Helpful ({review.helpful})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-luxury-charcoal hover:text-luxury-gold">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Not Helpful ({review.notHelpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Show More/Less Button */}
      {reviews.length > 3 && (
        <div className="text-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" onClick={() => setShowAllReviews(!showAllReviews)} className="bg-transparent">
              {showAllReviews ? (
                <>
                  Show Less Reviews
                  <ChevronUp className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Show All {reviews.length} Reviews
                  <ChevronDown className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  )
}
