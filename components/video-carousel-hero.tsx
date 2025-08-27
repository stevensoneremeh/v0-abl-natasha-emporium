"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react"

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
  const [isMobile, setIsMobile] = useState(false)
  const [showVideo, setShowVideo] = useState(true)
  const [videoError, setVideoError] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoDuration, setVideoDuration] = useState(50000) // 50 seconds minimum
  const [videoProgress, setVideoProgress] = useState(0)

  const currentVideo = videos[currentVideoIndex]

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

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
    if (prefersReducedMotion || !isPlaying) return

    const interval = setInterval(() => {
      nextVideo()
    }, videoDuration) // Use dynamic duration (minimum 50 seconds)

    return () => clearInterval(interval)
  }, [currentVideoIndex, isPlaying, prefersReducedMotion, videoDuration])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    setVideoError(false)
    setVideoLoaded(false)
    setIsPlaying(false)
    setVideoProgress(0)

    const loadAndPlayVideo = async () => {
      try {
        video.src = currentVideo.src
        video.poster = currentVideo.poster
        video.muted = true
        video.playsInline = true
        video.setAttribute("webkit-playsinline", "true")
        video.setAttribute("playsinline", "true")
        video.setAttribute("autoplay", "true")
        video.setAttribute("muted", "true")
        video.preload = "auto"

        const checkVideoExists = async () => {
          try {
            const response = await fetch(currentVideo.src, { method: "HEAD" })
            return response.ok
          } catch {
            return false
          }
        }

        const videoExists = await checkVideoExists()

        if (!videoExists) {
          console.log("[v0] Video file not found, using poster image")
          setVideoError(true)
          setVideoLoaded(true)
          setShowVideo(true)
          setIsTransitioning(false)
          return
        }

        video.load()

        const loadPromise = new Promise<void>((resolve) => {
          const timeout = setTimeout(() => {
            console.log("[v0] Video loading timeout, using poster fallback")
            setVideoError(true)
            setVideoLoaded(true)
            setShowVideo(true)
            setIsTransitioning(false)
            resolve()
          }, 15000)

          const onCanPlay = () => {
            clearTimeout(timeout)
            setVideoLoaded(true)
            setVideoError(false)
            cleanup()
            resolve()
          }

          const onLoadedData = () => {
            clearTimeout(timeout)
            setVideoLoaded(true)
            setVideoError(false)
            cleanup()
            resolve()
          }

          const onError = () => {
            clearTimeout(timeout)
            setVideoError(true)
            setVideoLoaded(true)
            setShowVideo(true)
            setIsTransitioning(false)
            cleanup()
            resolve()
          }

          const cleanup = () => {
            video.removeEventListener("canplay", onCanPlay)
            video.removeEventListener("error", onError)
            video.removeEventListener("loadeddata", onLoadedData)
          }

          video.addEventListener("canplay", onCanPlay)
          video.addEventListener("loadeddata", onLoadedData)
          video.addEventListener("error", onError)
        })

        await loadPromise

        if (!videoError && videoLoaded) {
          try {
            await video.play()
            setIsPlaying(true)
            setShowVideo(true)
            setIsTransitioning(false)

            if (video.duration && video.duration > 0) {
              setVideoDuration(Math.max(video.duration * 1000, 50000))
            }
          } catch (error) {
            console.log("[v0] Autoplay failed, showing poster with play button")
            setIsPlaying(false)
            setShowVideo(true)
            setIsTransitioning(false)
          }
        }
      } catch (error) {
        console.log("[v0] Video loading failed, using poster fallback")
        setVideoError(true)
        setIsPlaying(false)
        setShowVideo(true)
        setIsTransitioning(false)
        setVideoLoaded(true)
      }
    }

    loadAndPlayVideo()
  }, [currentVideoIndex, currentVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !isPlaying) return

    const updateProgress = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100
        setVideoProgress(progress)
      }
    }

    const interval = setInterval(updateProgress, 100)
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleVideoError = () => {
    setVideoError(true)
    setShowVideo(true)
    setIsPlaying(false)
    setIsTransitioning(false)
  }

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video || !videoLoaded) return

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
              <video
                ref={videoRef}
                className={`absolute inset-0 w-full h-full object-cover ${videoError ? "opacity-0" : "opacity-100"}`}
                autoPlay
                muted
                loop={false}
                playsInline
                poster={currentVideo.poster}
                preload="auto"
                onError={handleVideoError}
                controls={false}
                webkit-playsinline="true"
                x5-video-player-type="h5"
                x5-video-player-fullscreen="true"
                x5-video-orientation="portraint"
              >
                <source src={currentVideo.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <Image
                src={currentVideo.poster || "/placeholder.svg"}
                alt="Hero background"
                fill
                className={`object-cover transition-opacity duration-500 ${videoError || !videoLoaded ? "opacity-100" : "opacity-0"}`}
                priority
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 bg-black/40" />

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
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
                {currentVideo.title}
              </h1>

              <p className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed text-white/90">
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
        </div>
      </div>

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

      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {videos.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToVideo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentVideoIndex ? "bg-luxury-gold scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            disabled={isTransitioning}
          />
        ))}
      </div>

      {showVideo && videoLoaded && (
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

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-20">
        <motion.div
          className="h-full bg-luxury-gold"
          style={{ width: `${videoProgress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </section>
  )
}
