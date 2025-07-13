

"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

const GradientSection = () => {
  console.log("rendering");

  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => t,
      autoRaf: true,
    });

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    // Animating each word separately with fromTo
    const words = document.querySelectorAll(".popup");

    words.forEach((word, index) => {
      const isCool = word.textContent === "Cool"; // Check if the current word is "Cool"
      const animationConfig = {
        opacity: 0,
        scale: isCool ? 0 : 0, // Initial scale for "Cool" is 0
        y: 50, // Start position for the animation
      };

      const animationProps = {
        opacity: 1,
        scale: isCool ? 1.4 : 1, // Scale to 1.4 for "Cool", otherwise 1
        y: 0, // End position for the animation
        duration: 0.2, // Duration of the animation
        ease: "power2.out",
        stagger: {
          amount: 0.8, // Adds delay between each word animation
          from: "start", // Start staggering from the first word
        },
        scrollTrigger: {
          trigger: word, // Trigger the animation on this specific word
          start: "top 75%", // Adjusted to trigger earlier
          end: "top 30%",
          scrub: true, // Synchronize the animation with the scroll
          // markers: true, // Optional: turn this off for production
          onComplete: () => {
            if (isCool) {
              // Add bounce effect for "Cool"
              gsap.fromTo(
                word,
                { scale: 1.4 }, // Start scale for bounce
                {
                  scale: 1, // End scale for bounce
                  duration: 0.5, // Duration of the bounce
                  ease: "bounce.inOut", // Elastic ease for bounce effect
                }
              );
            }
          },
        },
      };

      gsap.fromTo(word, animationConfig, animationProps);
    });

    // Cleanup function
    return () => {
      // Kill all ScrollTriggers
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Destroy Lenis instance
      lenis.destroy();
      // Remove Lenis from GSAP ticker
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return (
    <div
      className="flex flex-col justify-center items-center h-screen"
      style={{
        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(6, 0, 16, 0) 30%),
        linear-gradient(0deg, rgba(6, 0, 16, 0.9) 4%, rgba(6, 0, 16, 0) 50%),
        radial-gradient(circle at 50% 70%, #25008C 0%, #170024 65%)`,
      }}
    >
      <div className="flex flex-col items-center leading-none">
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





