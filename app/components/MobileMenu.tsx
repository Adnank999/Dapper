"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
} from "lucide-react";
import { gsap } from "gsap";

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
];

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

export default function MobileMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Single container ref for better performance
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Animation timeline ref
  const tl = useRef<gsap.core.Timeline>(null);
  const isAnimating = useRef(false);

  // Memoized animation configuration for better performance
  const animationConfig = useMemo(
    () => ({
      duration: {
        main: 0.5,
        stagger: 0.04,
        micro: 0.2,
      },
      ease: {
        ease: "power4.out",
      },
    }),
    []
  );

  // Initialize GSAP timeline with optimized settings
  useEffect(() => {
    if (!menuContainerRef.current) return;

    const container = menuContainerRef.current;

    const searchBar = container.querySelector('[data-animate="search"]');
    const navHeader = container.querySelector('[data-animate="nav-header"]');
    const navItems = container.querySelectorAll('[data-animate="nav-item"]');
    const footer = container.querySelector('[data-animate="footer"]');

    // Create timeline with optimized settings
    tl.current = gsap.timeline({
      paused: true,
      defaults: {
        force3D: true,
        transformOrigin: "center center",
      },
    });

    // Set initial states
    gsap.set(container, {
      x: "100%",
      opacity: 0,
      willChange: "transform, opacity",
    });

    gsap.set([searchBar, navHeader], { y: -10, opacity: 0 });
    gsap.set(navItems, { y: 50, opacity: 0 }); // Added `y` for fade-in effect
    gsap.set(footer, { y: 10, opacity: 0 });

    // Build optimized animation timeline
    tl.current
      .to(container, {
        x: "0%",
        opacity: 1,
        duration: 0.3, // Faster duration
        ease: "power3.out", // Slightly snappier ease
      })
      .to(
        [searchBar, navHeader],
        {
          y: 0,
          opacity: 1,
          duration: 0.2, // Reduced duration
          ease: "power2.out",
          stagger: 0.05, // Reduced stagger
        },
        "-=0.2"
      )
      .to(
        navItems,
        {
          y: -20, // Smooth upward movement
          opacity: 1, // Fade-in effect
          duration: 0.4, // Slightly longer duration for smoother effect
          ease: "power2.out", // Smooth easing
          stagger: 0.1, // Staggered timing for each `navItem`
        },
        "-=0.15"
      )
      .to(
        footer,
        {
          y: 0,
          opacity: 1,
          duration: 0.2, // Faster footer animation
          ease: "power3.out",
        },
        "-=0.2"
      );

    return () => {
      if (tl.current) {
        tl.current.kill();
        tl.current = null;
      }
      gsap.set([container, searchBar, navHeader, navItems, footer], {
        clearProps: "all",
      });
    };
  }, []);

  // Optimized animation control
  useEffect(() => {
    if (!tl.current || isAnimating.current) return;

    isAnimating.current = true;

    if (isMenuOpen) {
      // Play animation forward
      tl.current.play().then(() => {
        isAnimating.current = false;
      });

      // Animate hamburger with hardware acceleration
      gsap.to(hamburgerRef.current, {
        rotation: 180,
        scale: 1.05,
        duration: animationConfig.duration.micro,
        ease: animationConfig.ease.main,
        force3D: true,
      });
    } else {
      // Reverse animation
      tl.current.reverse().then(() => {
        isAnimating.current = false;
      });

      // Reset hamburger
      gsap.to(hamburgerRef.current, {
        rotation: 0,
        scale: 1,
        duration: animationConfig.duration.micro,
        ease: animationConfig.ease.main,
        force3D: true,
      });
    }
  }, [isMenuOpen, animationConfig]);

  // Memoized event handlers
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  }, []);

  const handleNavClick = useCallback(() => {
    if (isAnimating.current) return;

    const navItems = menuContainerRef.current?.querySelectorAll(
      '[data-animate="nav-item"]'
    );
    if (navItems) {
      gsap.to(navItems, {
        scale: 0.98,
        opacity: 0.8,
        duration: 0.15,
        ease: "power2.out",
        force3D: true,
        onComplete: () => setIsMenuOpen(false),
      });
    }
  }, []);

  const handleToggleMenu = useCallback(() => {
    if (isAnimating.current) return;
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Optimized hover handlers with throttling
  const createHoverHandler = useCallback((direction: "enter" | "leave") => {
    return (e: React.MouseEvent<HTMLElement>) => {
      const target = e.currentTarget;

      if (direction === "enter") {
        gsap.to(target, {
          x: 6,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        });
      } else {
        gsap.to(target, {
          x: 0,
          duration: 0.25,
          ease: "power2.out",
          force3D: true,
        });
      }
    };
  }, []);

  const handleMouseEnter = useMemo(
    () => createHoverHandler("enter"),
    [createHoverHandler]
  );
  const handleMouseLeave = useMemo(
    () => createHoverHandler("leave"),
    [createHoverHandler]
  );

  // Optimized search input handlers
  const handleSearchFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      gsap.to(e.target, {
        scale: 1.01,
        duration: 0.2,
        ease: "power2.out",
        force3D: true,
      });
    },
    []
  );

  const handleSearchBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      gsap.to(e.target, {
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        force3D: true,
      });
    },
    []
  );

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
    const clearBtn = document.querySelector(".search-clear");
    if (clearBtn) {
      gsap.fromTo(
        clearBtn,
        { scale: 1 },
        {
          scale: 0.9,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          force3D: true,
        }
      );
    }
  }, []);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          ref={hamburgerRef}
          onClick={handleToggleMenu}
          className="p-2 rounded-md backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors will-change-transform"
          aria-label="Toggle menu"
          style={{ willChange: "transform" }}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        ref={menuContainerRef}
        className="fixed px-4 inset-0 bg-transparent/60 backdrop-blur-lg transition-transform duration-300 z-40 flex flex-col will-change-transform"
        onKeyDown={handleKeyDown}
        style={{
          transform: "translateX(100%)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        {/* Search Bar */}
        <div
          data-animate="search"
          className="p-6 border-b border-gray-700/50 will-change-transform"
        >
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-600/50 rounded-lg pl-10 pr-16 py-3 text-white placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 will-change-transform"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              style={{ willChange: "transform" }}
            />
            <button
              onClick={handleSearchClear}
              className="search-clear absolute right-3 top-1/2 transform -translate-y-1/2 px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-sm border border-gray-600/50 hover:bg-gray-600/50 transition-colors will-change-transform"
            >
              ESC
            </button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2
              data-animate="nav-header"
              className="text-gray-400 text-sm font-medium mb-6 tracking-wider uppercase will-change-transform"
            >
              Navigation
            </h2>

            <nav className="space-y-1 ">
              {navLinks.map((link, index) => {
                const IconComponent = link.icon;
                return (
                  <div
                    key={link.name}
                    data-animate="nav-item"
                    className="will-change-transform"
                  >
                    <a
                      href={link.href}
                      onClick={handleNavClick}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-800/50 transition-all duration-300 group cursor-pointer will-change-transform"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      style={{ willChange: "transform" }}
                    >
                      <div className="shrink-0 mt-1">
                        <IconComponent
                          className="text-gray-400 group-hover:text-white transition-colors"
                          size={20}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-my-font-bold tracking-wide text-4xl text-white font-medium group-hover:text-blue-400 transition-colors">
                            {link.name}
                          </h3>
                          {link.badge && (
                            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium">
                              {link.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer with Social Links and Navigation */}
        <div
          data-animate="footer"
          className="border-t border-gray-700/50 p-6 will-change-transform"
        >
          <div className="flex items-center justify-between">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 will-change-transform"
                    aria-label={social.label}
                    onMouseEnter={(e) => {
                      gsap.to(e.currentTarget, {
                        y: -2,
                        duration: 0.2,
                        ease: "power2.out",
                        force3D: true,
                      });
                    }}
                    onMouseLeave={(e) => {
                      gsap.to(e.currentTarget, {
                        y: 0,
                        duration: 0.2,
                        ease: "power2.out",
                        force3D: true,
                      });
                    }}
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 text-gray-400">
              <button
                className="p-1 hover:text-white transition-colors will-change-transform"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.15,
                    duration: 0.2,
                    force3D: true,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                    force3D: true,
                  });
                }}
              >
                <ChevronUp size={16} />
              </button>
              <button
                className="p-1 hover:text-white transition-colors will-change-transform"
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.15,
                    duration: 0.2,
                    force3D: true,
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2,
                    force3D: true,
                  });
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
  );
}
