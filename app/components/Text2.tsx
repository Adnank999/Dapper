"use client";

import React, { useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";
import { ColourfulText } from "./ColorFulText";
import { useMenuContext } from "../context/MenuContext";

const fk = localFont({
  src: "../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
});

gsap.registerPlugin(ScrollTrigger);

const TextWithParticles = () => {
  const text = "HELLO FROM";
  const particleContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const {isMenuOpen} = useMenuContext();

  useEffect(() => {
    
    const containerElement = containerRef.current!;
    const animationContainer = animationContainerRef.current!;

    gsap.to(animationContainer, {
      opacity: isMenuOpen ? 0 : 1,
      duration: 0.5, // Smooth fade duration
      display: isMenuOpen ? "block" : "hidden", // Handle display property
      ease: "power2.out",
    });
    // Check if text spans are already appended to avoid duplication
    if (containerElement?.querySelector(".text-container")) {
      return;
    }

    // Create a container for the text spans dynamically
    const textContainer = document.createElement("div");
    textContainer.className = "text-container"
    textContainer.style.fontSize = "6rem";
    textContainer.style.textAlign = "center";
    textContainer.style.position = "relative";
    textContainer.style.display = "inline-block";
    textContainer.style.whiteSpace = "nowrap";
    textContainer.className = `${fk.className}`;

    // Add spans for each character of the text
    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char;
      // span.style.display = "inline-block";
      span.style.opacity = "1";
      textContainer.appendChild(span);
    });

    // Append the textContainer to the main container
    containerElement?.appendChild(textContainer);

    const spans = textContainer?.querySelectorAll("span");

    // Generate particle effect for each character
    const generateParticles = (char: HTMLElement) => {
      const container = particleContainerRef?.current;
      const rect = char.getBoundingClientRect();

      for (let i = 0; i < 5; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.top = `${rect.top + window.scrollY + 100}px`;
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.width = `${gsap.utils.random(3, 7)}px`;
        particle.style.height = `${gsap.utils.random(3, 7)}px`;
        particle.style.background = "linear-gradient(45deg, #0ff, #0bb, #08f)";
        particle.style.borderRadius = "50%";
        particle.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.7)";
        particle.style.pointerEvents = "none";

        container?.appendChild(particle);

        gsap.to(particle, {
          x: gsap.utils.random(50, 150),
          y: gsap.utils.random(-50, 50),
          opacity: 0,
          duration: gsap.utils.random(1, 1.5),
          ease: "power3.out",
          onComplete: () => {
            container?.removeChild(particle);
          },
        });
      }
    };

    // Animate spans and add ScrollTrigger
    gsap.to(spans, {
      x: 50, // Move text to the right
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: containerElement,
        start: "top top",
        end: "bottom center",
        scrub: true,
        
        onUpdate: (self) => {
          const progress = self.progress;
          spans.forEach((char, index) => {
            if (progress > index / spans.length) {
              generateParticles(char as HTMLElement);
            }
          });
        },
      },
    });

    return () => {
      // Cleanup
      containerElement.removeChild(textContainer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMenuOpen]);

  console.log(isMenuOpen)
  return (
   
    <div ref={animationContainerRef} className={`relative`}>
      <div
        ref={particleContainerRef}
        style={{
          position: "absolute",
          top: -20,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      ></div>

      <div
        ref={containerRef}
        style={{
          // position: "relative",
          height: "100vh",
         
          backgroundColor: "transparent",
        }}
        className="flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
      >
        <div className={`${fk.className} text-6xl md:text-6xl lg:text-8xl `}>
          <ColourfulText text="ADNAN" />
        </div>
      </div>
    </div>
  );
};

export default TextWithParticles;
