"use client";

import { useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useMenuContext } from "../context/MenuContext";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import MobileMenu from "./MobileMenu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LoginButton from "./LoginLogoutButton";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT", href: "/about" },
  { name: "PROJECTS", href: "/projects" },
  { name: "CONTACT", href: "/contact" },
];

export const CurvedNavbar = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenuContext();
  const router = useRouter();
  const navbarRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0); // For manual scroll tracking

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  let lastScroll = useRef(0);

  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;

    // gsap.set(navbar, { y: 0, opacity: 1 });

    // const onScroll = () => {
    //   const currentScroll = window.scrollY;

    //   if (currentScroll > lastScroll.current) {
    //     // Scroll Down
    //     gsap.to(navbar, {
    //       y: -100,
    //       opacity: 0,
    //       duration: 0.4,
    //       ease: "power2.out",
    //     });
    //   } else if (currentScroll < lastScroll.current ) {
    //     // Scroll Up
    //     gsap.to(navbar, {
    //       y: 0,
    //       opacity: 1,
    //       duration: 0.4,
    //       ease: "power2.out",
    //     });
    //   }

    //   lastScroll.current = currentScroll;
    // };

    const onScroll = () => {
      const currentScroll = window.scrollY;
      // console.log(
      //   "Current Scroll:",
      //   currentScroll,
      //   "Last Scroll:",
      //   lastScroll.current
      // );

      if (currentScroll > lastScroll.current) {
        // Scroll Down
        gsap.to(navbar, {
          yPercent: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      } else if (currentScroll < lastScroll.current) {
        // Scroll Up
        gsap.to(navbar, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigationTransition = (url: string) => {
    if (!document.startViewTransition) {
      router.push("/");
      return;
    }

    document.startViewTransition(() => {
      router.push(url);
    });
  };

  return (
    <div className="relative z-[50]">
      {/* Desktop Navbar */}
      
      <nav
        ref={navbarRef}
        className="max-w-fit z-1000 cursor-pointer mt-10 hidden md:flex fixed top-0 left-1/2 !transform !-translate-x-1/2 backdrop-blur-md bg-white/10 border border-white/20 shadow-lg px-8 py-1 rounded-full transition-all duration-300"
      >
        <ul className="flex justify-center items-center gap-8 text-white font-normal text-xl">
          {navLinks.map(({ name, href }) => (
            <li
              key={name}
              className="relative font-my-font-bold tracking-wide text-lg rounded-full px-5 py-1 transition duration-300 hover:border-b hover:border-b-blue-400 hover:shadow-[0_4px_10px_2px_rgba(59,130,246,0.5)]"
              onClick={(e) => {
                e.preventDefault(); // Prevent default link behavior
                handleNavigationTransition(href); // Trigger page transition
              }}
            >
              <Link href={href}>{name}</Link>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px hover:bg-linear-to-r from-transparent via-blue-500 to-transparent h-px" />
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute top-5 right-0">
         <LoginButton/>
      </div>
     
      <MobileMenu />
    </div>
  );
};

export default CurvedNavbar;
