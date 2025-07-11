"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Menu,
  X,
  Search,
  Home,
  FolderOpen,
  FileText,
  MessageSquare,
  Link,
  User,
  Linkedin,
  Github,
  Twitter,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { gsap } from "gsap"

const navLinks = [
  {
    name: "Home",
    icon: Home,
    description: "Welcome to my forever work-in-progress!",
    href: "#",
  },
  {
    name: "Projects",
    icon: FolderOpen,
    description: "Showcase of my projects",
    href: "#",
  },
  {
    name: "Blog",
    icon: FileText,
    description: "Thoughts, mental models, and tutorials",
    href: "#",
    badge: "Current",
  },
  {
    name: "Guestbook",
    icon: MessageSquare,
    description: "Leave a message for me",
    href: "#",
  },
  {
    name: "Links",
    icon: Link,
    description: "All my links are here",
    href: "#",
  },
  {
    name: "About",
    icon: User,
    description: "Learn more about me!",
    href: "#",
  },
]

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
]

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Refs for GSAP animations
  const menuOverlayRef = useRef<HTMLDivElement>(null)
  const searchBarRef = useRef<HTMLDivElement>(null)
  const navigationHeaderRef = useRef<HTMLHeadingElement>(null)
  const navItemsRef = useRef<HTMLDivElement[]>([])
  const footerRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Animation timeline
  const tl = useRef<gsap.core.Timeline>()

  useEffect(() => {
    // Initialize GSAP timeline
    tl.current = gsap.timeline({ paused: true })

    if (menuOverlayRef.current) {
      // Set initial states
      gsap.set(menuOverlayRef.current, {
        x: "100%",
        opacity: 0,
      })

      gsap.set([searchBarRef.current, navigationHeaderRef.current], {
        y: -30,
        opacity: 0,
      })

      gsap.set(navItemsRef.current, {
        x: 50,
        opacity: 0,
      })

      gsap.set(footerRef.current, {
        y: 30,
        opacity: 0,
      })

      // Build animation timeline
      tl.current
        // Menu overlay slides in with fade
        .to(menuOverlayRef.current, {
          x: "0%",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        })
        // Search bar animates in
        .to(
          searchBarRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.3",
        )
        // Navigation header fades in
        .to(
          navigationHeaderRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          },
          "-=0.2",
        )
        // Navigation items stagger in
        .to(
          navItemsRef.current,
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.1",
        )
        // Footer slides up
        .to(
          footerRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2",
        )
    }
  }, [])

  useEffect(() => {
    if (tl.current) {
      if (isMenuOpen) {
        // Play animation forward
        tl.current.play()
        // Animate hamburger icon
        gsap.to(hamburgerRef.current, {
          rotation: 180,
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        })
      } else {
        // Reverse animation
        tl.current.reverse()
        // Reset hamburger icon
        gsap.to(hamburgerRef.current, {
          rotation: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }, [isMenuOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  const handleNavClick = () => {
    // Add a subtle exit animation before closing
    gsap.to(navItemsRef.current, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.out",
      onComplete: () => {
        setIsMenuOpen(false)
      },
    })
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          ref={hamburgerRef}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="p-2 rounded-md backdrop-blur bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuOverlayRef}
        className="fixed px-4 inset-0 bg-transparent/60 backdrop-blur-lg transition-transform duration-300 z-40 flex flex-col"
        onKeyDown={handleKeyDown}
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        {/* Search Bar */}
        <div ref={searchBarRef} className="p-6 border-b border-gray-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-16 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              autoFocus
              onFocus={(e) => {
                gsap.to(e.target, {
                  scale: 1.02,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }}
              onBlur={(e) => {
                gsap.to(e.target, {
                  scale: 1,
                  duration: 0.2,
                  ease: "power2.out",
                })
              }}
            />
            <button
              onClick={() => {
                setSearchQuery("")
                gsap.fromTo(".search-clear", { scale: 1 }, { scale: 0.8, duration: 0.1, yoyo: true, repeat: 1 })
              }}
              className="search-clear absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 ref={navigationHeaderRef} className="text-gray-400 text-sm font-medium mb-6 tracking-wider uppercase">
              Navigation
            </h2>

            <nav className="space-y-1">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon
                return (
                  <div
                    key={link.name}
                    ref={(el) => {
                      if (el) navItemsRef.current[index] = el
                    }}
                  >
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer"
                      onMouseEnter={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 8,
                          duration: 0.3,
                          ease: "power2.out",
                        })
                      }}
                      onMouseLeave={(e) => {
                        gsap.to(e.currentTarget, {
                          x: 0,
                          duration: 0.3,
                          ease: "power2.out",
                        })
                      }}
                    >
                      <div className="flex-shrink-0 mt-1">
                        <IconComponent className="text-gray-400 group-hover:text-white transition-colors" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white font-medium text-lg group-hover:text-blue-400 transition-colors">
                            {link.name}
                          </h3>
                          {link.badge && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium animate-pulse">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{link.description}</p>
                      </div>
                    </a>
                  </div>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Footer with Social Links and Navigation */}
        <div ref={footerRef} className="border-t border-gray-700/50 p-6">
          <div className="flex items-center justify-between">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label={social.label}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        y: -3,
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        y: 0,
                        duration: 0.2,
                        ease: "power2.out",
                      })
                    }}
                  >
                    <IconComponent size={20} />
                  </a>
                )
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 text-gray-400">
              <button
                className="p-1 hover:text-white transition-colors"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.2, duration: 0.2 })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                }}
              >
                <ChevronUp size={16} />
              </button>
              <button
                className="p-1 hover:text-white transition-colors"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.2, duration: 0.2 })
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
                }}
              >
                <ChevronDown size={16} />
              </button>
              <span className="text-sm ml-2">navigate</span>
            </div>
          </div>
        </div>
      </div>

     
    </>
  )
}
