"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface VideoCarouselHeroProps {
  videos: Array<{
    src: string
    poster: string
    title: string
    subtitle: string
  }>
  primaryCTA: {
    text: string
    href: string
  }
  secondaryCTA: {
    text: string
    href: string
  }
}

export function VideoCarouselHero({ videos, primaryCTA, secondaryCTA }: VideoCarouselHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [videoError, setVideoError] = useState(true) // Start with error state for better fallback
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const currentVideo = videos[currentVideoIndex]

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleMediaQueryChange)

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange)
    }
  }, [isClient])

  useEffect(() => {
    if (prefersReducedMotion) return

    const interval = setInterval(() => {
      nextVideo()
    }, 50000) // Fixed 50 second duration

    return () => clearInterval(interval)
  }, [currentVideoIndex, prefersReducedMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isClient) return

    // Reset states
    setVideoError(true) // Start with error state
    setIsPlaying(false)
    setVideoProgress(0)
    setShowVideo(true) // Always show the section

    const loadVideo = async () => {
      try {
        video.src = currentVideo.src
        video.poster = currentVideo.poster
        video.muted = true
        video.playsInline = true
        video.preload = "none"

        const loadTimeout = setTimeout(() => {
          setVideoError(true)
          setIsTransitioning(false)
        }, 5000)

        video.addEventListener(
          "loadeddata",
          () => {
            clearTimeout(loadTimeout)
            setVideoError(false)
            video
              .play()
              .then(() => {
                setIsPlaying(true)
              })
              .catch(() => {
                setIsPlaying(false)
              })
            setIsTransitioning(false)
          },
          { once: true },
        )

        video.addEventListener(
          "error",
          () => {
            clearTimeout(loadTimeout)
            setVideoError(true)
            setIsTransitioning(false)
          },
          { once: true },
        )

        video.load()
      } catch (error) {
        setVideoError(true)
        setIsTransitioning(false)
      }
    }

    loadVideo()
  }, [currentVideoIndex, currentVideo, isClient])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isPlaying || videoError) return

    const updateProgress = () => {
      if (video.duration && video.duration > 0) {
        const progress = (video.currentTime / video.duration) * 100
        setVideoProgress(progress)
      }
    }

    const interval = setInterval(updateProgress, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, videoError])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video || videoError) return

    if (isPlaying) {
      video.pause()
      setIsPlaying(false)
    } else {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }
  }

  const nextVideo = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length)
  }

  const prevVideo = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length)
  }

  const goToVideo = (index: number) => {
    if (isTransitioning || index === currentVideoIndex) return
    setIsTransitioning(true)
    setCurrentVideoIndex(index)
  }

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentVideoIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={
                  currentVideo.poster || "/placeholder.svg?height=1080&width=1920&query=luxury real estate background"
                }
                alt={currentVideo.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />

              {isClient && !videoError && (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay={false}
                  muted
                  loop={false}
                  playsInline
                  preload="none"
                  onError={() => setVideoError(true)}
                  controls={false}
                >
                  <source src={currentVideo.src} type="video/mp4" />
                </video>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideoIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                {currentVideo.title}
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed text-white/90">
                {currentVideo.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={primaryCTA.href}>
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 font-semibold"
                >
                  {primaryCTA.text}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={secondaryCTA.href}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-foreground text-lg px-10 py-6 bg-transparent font-semibold"
                >
                  {secondaryCTA.text}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-4 flex items-center z-20">
        <motion.button
          onClick={prevVideo}
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isTransitioning}
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.button>
      </div>

      <div className="absolute inset-y-0 right-4 flex items-center z-20">
        <motion.button
          onClick={nextVideo}
          className="bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={isTransitioning}
        >
          <ChevronRight className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Video Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {videos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToVideo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentVideoIndex ? "bg-primary scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            disabled={isTransitioning}
          />
        ))}
      </div>

      {/* Play/Pause Button - only show when video is available */}
      {isClient && !videoError && (
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

      {/* Progress Bar - only show when video is playing */}
      {isClient && !videoError && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
          <motion.div
            className="h-full bg-primary"
            style={{ width: `${videoProgress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}
    </section>
  )
}
