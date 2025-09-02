"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Pause } from "lucide-react"

interface VideoHeroProps {
  videoSrc: string
  posterImage: string
  overlayImages?: Array<{
    src: string
    alt: string
    className?: string
  }>
  title: string
  subtitle: string
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA: {
    text: string
    href: string
  }
}

export function VideoHero({
  videoSrc,
  posterImage,
  overlayImages = [],
  title,
  subtitle,
  primaryCTA,
  secondaryCTA,
}: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (prefersReducedMotion) {
      video.pause()
      setIsPlaying(false)
      setShowVideo(false)
    } else {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true)
            setShowVideo(true)
          })
          .catch(() => {
            // Autoplay failed, but still show video with manual controls
            setIsPlaying(false)
            setShowVideo(true)
          })
      }
    }
  }, [prefersReducedMotion])

  const handleVideoError = () => {
    setVideoError(true)
    setShowVideo(false)
    setIsPlaying(false)
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
        })
    }
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        {showVideo && !videoError ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay={!isMobile} // Only autoplay on desktop
            muted
            loop
            playsInline
            poster={posterImage}
            preload={isMobile ? "none" : "metadata"} // Optimize loading for mobile
            onError={handleVideoError}
            controls={isMobile && !isPlaying} // Show controls on mobile when paused
          >
            <source src={videoSrc} type="video/mp4" />
            {/* Fallback image if video fails to load */}
            <Image
              src={posterImage || "/placeholder.svg"}
              alt="Hero background"
              fill
              className="object-cover"
              priority
            />
          </video>
        ) : (
          <Image src={posterImage || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />
        )}
      </div>

      {/* Overlay Images */}
      {overlayImages.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute ${image.className || ""}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            width={300}
            height={400}
            className="rounded-lg shadow-2xl"
          />
        </motion.div>
      ))}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            {subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="bg-luxury-gold text-luxury-navy hover:bg-luxury-gold/90 text-lg px-10 py-6 font-semibold"
              >
                {primaryCTA.text}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-luxury-navy text-lg px-10 py-6 bg-transparent font-semibold"
              >
                {secondaryCTA.text}
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <motion.div
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Video Controls */}
      {showVideo && !videoError && (
        <motion.button
          onClick={togglePlayPause}
          className="absolute bottom-6 right-6 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </motion.button>
      )}
    </section>
  )
}
