"use client";
import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// Remove Lenis import from here
gsap.registerPlugin(ScrollTrigger);
const GradientSection = () => {
  useEffect(() => {
    // Register GSAP ScrollTrigger plugin

    // 👈 Remove all Lenis initialization code

    // Animating each word separately with fromTo
    const words = document.querySelectorAll(".popup");

    words.forEach((word, index) => {
      const isCool = word.textContent === "Cool";
      const animationConfig = {
        opacity: 0,
        scale: isCool ? 0 : 0,
        y: 50,
      };

      const animationProps = {
        opacity: 1,
        scale: isCool ? 1.4 : 1,
        y: 0,
        duration: 0.2,
        ease: "power2.out",
        stagger: {
          amount: 0.8,
          from: "start",
        },
        scrollTrigger: {
          trigger: word,
          start: "top 75%",
          end: "top 30%",
          scrub: true,
          // markers: true, // Enable for debugging
          onComplete: () => {
            if (isCool) {
              gsap.fromTo(
                word,
                { scale: 1.4 },
                {
                  scale: 1,
                  duration: 0.5,
                  ease: "bounce.inOut",
                }
              );
            }
          },
        },
      };

      gsap.fromTo(word, animationConfig, animationProps);
    });

    // Cleanup function - only kill ScrollTriggers
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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
