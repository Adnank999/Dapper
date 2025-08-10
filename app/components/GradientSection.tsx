"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const GradientSection = () => {
  const lenis = useLenis();

  useEffect(() => {
    // Integrate Lenis with ScrollTrigger
    if (lenis) {
      // Connect Lenis scroll events to ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      // Since you're controlling RAF in the wrapper, we don't need to add ticker here
      // Just ensure ScrollTrigger refreshes properly
      ScrollTrigger.refresh();
    }

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // Animating each word separately
      const words = document.querySelectorAll(".popup");

      words.forEach((word, index) => {
        const isCool = word.textContent?.trim() === "Cool";

        // Initial state
        gsap.set(word, {
          opacity: 0,
          scale: 0,
          y: 50,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: word,
            start: "top 85%",
            end: "top 15%",
            scrub: 1.2,
            // markers: true, // Enable for debugging
            refreshPriority: -1,
            invalidateOnRefresh: true,
          },
        });

        // Main animation
        tl.to(word, {
          opacity: 1,
          scale: isCool ? 1.4 : 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });

        // Special bounce effect for "Cool" - separate ScrollTrigger
        if (isCool) {
          tl.to(
            word,
            {
              scale: 1.2,
              duration: 0.4,
              ease: "back.out(1.2)", // Gentler than bounce
            },
            "+=0.1"
          );
        }
      });
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (lenis) {
        lenis.off("scroll", ScrollTrigger.update);
      }
    };
  }, [lenis]);

  return (
    <div
      className="flex flex-col justify-center items-center h-screen"
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(6, 0, 16, 0) 30%),
        linear-gradient(0deg, rgba(6, 0, 16, 0.9) 4%, rgba(6, 0, 16, 0) 50%),
        radial-gradient(circle at 50% 70%, #25008C 0%, #170024 65%)`,
      }}
    >
      <div className="font-my-font-medium flex flex-col items-center leading-none">
        <div className="popup text-[153px] font-extrabold text-center tracking-wider text-white">
          Build
        </div>
        <div className="popup text-[220px] font-extrabold text-center tracking-wider text-[#0099fc]">
          Cool
        </div>
        <div className="popup text-[153px] font-extrabold text-center tracking-wider text-white">
          Stuff
        </div>
      </div>
    </div>
  );
};

export default GradientSection;
