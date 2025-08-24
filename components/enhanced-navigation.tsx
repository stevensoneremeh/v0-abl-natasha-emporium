"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingBag, User, Search, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image"

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Categories", href: "/categories" },
  { name: "Real Estate", href: "/real-estate" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export function EnhancedNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, isGuest } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b border-border"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center space-x-3">
              <motion.div whileHover={{ rotate: 5 }} transition={{ duration: 0.3 }}>
                <Image
                  src="/images/abl-logo.png"
                  alt="ABL NATASHA ENTERPRISES"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ABL NATASHA ENTERPRISES
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className="relative text-foreground hover:text-primary transition-colors duration-200 font-medium group"
                >
                  {item.name}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300"
                    whileHover={{ width: "100%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search */}
            <motion.div className="relative" initial={false} animate={{ width: searchOpen ? 300 : 40 }}>
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center"
                  >
                    <Input
                      placeholder="Search products..."
                      className="pr-10 border-primary/20 focus:border-primary"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2"
                      onClick={() => setSearchOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : (
                  <Button variant="ghost" size="sm" onClick={() => setSearchOpen(true)} className="hover:bg-primary/10">
                    <Search className="h-4 w-4" />
                  </Button>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Wishlist */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" className="relative hover:bg-primary/10">
                <Heart className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  3
                </Badge>
              </Button>
            </motion.div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="sm" className="relative hover:bg-primary/10">
                <ShoppingBag className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground">
                  2
                </Badge>
              </Button>
            </motion.div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Account */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {user ? (
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                    <User className="h-4 w-4 mr-2" />
                    {user.email?.split("@")[0]}
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    Sign In
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.div className="lg:hidden" whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="hover:bg-primary/10">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border bg-card/50 backdrop-blur-sm"
            >
              <div className="py-4 space-y-2">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      className="block px-4 py-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="px-4 pt-4 border-t border-border space-y-2">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="flex-1 justify-start">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ShoppingBag className="h-4 w-4" />
                    </Button>
                    {/* Theme Toggle */}
                    <ThemeToggle />
                  </div>

                  {user ? (
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        My Account
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-primary to-accent">Sign In</Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
