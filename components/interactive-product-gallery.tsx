"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface InteractiveProductGalleryProps {
  images: string[]
  productName: string
  badges?: Array<{
    text: string
    variant: "featured" | "discount" | "lowStock"
  }>
}

export function InteractiveProductGallery({ images, productName, badges = [] }: InteractiveProductGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePosition({ x, y })
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case "featured":
        return "bg-luxury-gold text-luxury-navy"
      case "discount":
        return "bg-red-500 text-white"
      case "lowStock":
        return "bg-orange-500 text-white"
      default:
        return "bg-luxury-gold text-luxury-navy"
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div
        className="relative aspect-square overflow-hidden rounded-lg bg-white cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onClick={() => setIsZoomed(!isZoomed)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="relative w-full h-full"
          >
            <Image
              src={images[currentImage] || "/placeholder.svg?height=600&width=600"}
              alt={`${productName} - Image ${currentImage + 1}`}
              fill
              className={`object-cover transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"}`}
              style={{
                transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
              }}
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Badge className={`${getBadgeStyles(badge.variant)} font-semibold`}>{badge.text}</Badge>
            </motion.div>
          ))}
        </div>

        {/* Zoom Icon */}
        <motion.div
          className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isZoomed ? 1 : 0.7 }}
          whileHover={{ scale: 1.1 }}
        >
          <ZoomIn className="h-4 w-4 text-luxury-navy" />
        </motion.div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="h-5 w-5 text-luxury-navy" />
            </motion.button>
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="h-5 w-5 text-luxury-navy" />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentImage + 1} / {images.length}
          </div>
        )}
      </motion.div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <motion.div
          className="grid grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {images.slice(0, 4).map((image, index) => (
            <motion.div
              key={index}
              className={`relative aspect-square overflow-hidden rounded-lg bg-white cursor-pointer border-2 transition-all duration-200 ${
                index === currentImage
                  ? "border-luxury-gold shadow-lg"
                  : "border-transparent hover:border-luxury-gold/50"
              }`}
              onClick={() => setCurrentImage(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image
                src={image || "/placeholder.svg?height=150&width=150"}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
              {index === currentImage && (
                <motion.div
                  className="absolute inset-0 bg-luxury-gold/20"
                  layoutId="activeThumb"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
