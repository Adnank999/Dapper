"use client";

import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useMenuContext } from "../context/MenuContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MobileMenu from "./MobileMenu";

gsap.registerPlugin(ScrollTrigger);

const navLinks = ["HOME", "ABOUT", "PROJECTS", "CONTACT"];

export const CurvedNavbar = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenuContext();
  const navbarRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0); // For manual scroll tracking

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    let lastScroll = 0;

    const onScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll + 5) {
        // Scroll Down
        gsap.to(navbar, {
          y: -100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      } else if (currentScroll < lastScroll - 1) {
        // Scroll Up
        gsap.to(navbar, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav
        ref={navbarRef}
        className="max-w-fit z-[1000]  cursor-pointer mt-10 hidden md:flex fixed top-0 left-1/2 transform -translate-x-1/2 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg px-8 !py-1 rounded-full transition-all duration-300"
      >
        <ul className="flex justify-center items-center gap-8 text-white  font-normal text-xl">
          {navLinks.map((link) => (
            <li
              key={link}
              className="relative font-myFontBold  tracking-wide text-lg rounded-full px-5 py-1 transition duration-300 hover:border-b hover:border-b-blue-400 hover:shadow-[0_4px_10px_2px_rgba(59,130,246,0.5)]"
            >
              {link}
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px hover:bg-gradient-to-r from-transparent via-blue-500 to-transparent  h-px" />
            </li>
          ))}
        </ul>
      </nav>

      <MobileMenu />
    </>
  );
};

export default CurvedNavbar;
