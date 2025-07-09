




// "use client";

// import React, { useContext, useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import localFont from "next/font/local";
// import { ColourfulText } from "./ColorFulText";
// import { useMenuContext } from "../context/MenuContext";

// const fk = localFont({
//   src: "../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
// });

// gsap.registerPlugin(ScrollTrigger);

// const TextWithParticles = () => {
//   const text = "HELLO FROM";
//   const particleContainerRef = useRef<HTMLDivElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const animationContainerRef = useRef<HTMLDivElement | null>(null);
//   const { isMenuOpen } = useMenuContext();

//   const spanMap = new WeakMap<Element, boolean>();
//   let scrollDirection: "up" | "down" = "down";
//   let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

//   useEffect(() => {
//     const scrollHandler = () => {
//       const currentY = window.scrollY;
//       scrollDirection = currentY > lastScrollY ? "down" : "up";
//       lastScrollY = currentY;
//     };

//     window.addEventListener("scroll", scrollHandler);

//     const containerElement = containerRef.current!;
//     const animationContainer = animationContainerRef.current!;

//     gsap.to(animationContainer, {
//       opacity: isMenuOpen ? 0 : 1,
//       duration: 0.5,
//       display: isMenuOpen ? "block" : "hidden",
//       ease: "power2.out",
//     });

//     if (containerElement?.querySelector(".text-container")) {
//       return () => window.removeEventListener("scroll", scrollHandler);
//     }

//     const textContainer = document.createElement("div");
//     textContainer.className = `text-container ${fk.className}`;
//     textContainer.style.cssText = `
//       font-size: 6rem;
//       text-align: center;
//       position: relative;
//       display: inline-block;
//       white-space: nowrap;
//     `;

//     Array.from(text).forEach((char) => {
//       const span = document.createElement("span");
//       span.innerText = char;
//       span.style.opacity = "1";
//       textContainer.appendChild(span);
//     });

//     containerElement.appendChild(textContainer);

//     const spans = textContainer?.querySelectorAll("span");

//     const generateParticles = (char: HTMLElement) => {
//       const container = particleContainerRef?.current;
//       const rect = char.getBoundingClientRect();

//       for (let i = 0; i < 50; i++) {
//         const particle = document.createElement("div");
//         particle.style.position = "absolute";
//         particle.style.top = `${rect.top + window.scrollY + 80}px`;
//         particle.style.left = `${rect.left + rect.width / 2 }px`;
//         particle.style.width = `${gsap.utils.random(3, 7)}px`;
//         particle.style.height = `${gsap.utils.random(3, 7)}px`;
//         particle.style.background =
//           "linear-gradient(45deg, #0ff, #0bb, #08f)";
//         particle.style.borderRadius = "50%";
//         particle.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.7)";
//         particle.style.pointerEvents = "none";

//         container?.appendChild(particle);

//         const xOffset =
//           scrollDirection === "down"
//             ? gsap.utils.random(50, 250)
//             : gsap.utils.random(-150, -50);

      

//         gsap.to(particle, {
//           x: xOffset,
//           y: gsap.utils.random(-50, 50),
//           opacity: 0,
//           duration: gsap.utils.random(1, 1.5),
//           ease: "power.out",
//           onComplete: () => {
//             container?.removeChild(particle);
//           },
//         });
//       }
//     };

//     gsap.to(spans, {
//       x: 50,
//       opacity: 0,
//       duration: 1,
//       stagger: 0.1,
//       ease: "power2.out",
//       scrollTrigger: {
//         trigger: containerElement,
//         start: "top top",
//         end: "bottom center",
//         scrub: true,

//         onUpdate: (self) => {
//           const progress = self.progress;
//           spans.forEach((char, index) => {
//             if (progress > index / spans.length && !spanMap.get(char)) {
//               generateParticles(char as HTMLElement);
//               spanMap.set(char, true);
//             }
//           });
//         },

//         // onLeaveBack: () => {
//         //   spans.forEach((char) => spanMap.delete(char));
//         // },
//       },
//     });

//     return () => {
//       window.removeEventListener("scroll", scrollHandler);
//       containerElement.removeChild(textContainer);
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, [isMenuOpen]);

//   return (
//     <div ref={animationContainerRef} className="relative">
//       <div
//         ref={particleContainerRef}
//         style={{
//           position: "absolute",
//           top: -20,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           pointerEvents: "none",
//         }}
//       ></div>

//       <div
//         ref={containerRef}
//         style={{
//           height: "100vh",
//           backgroundColor: "transparent",
//         }}
//         className="flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
//       >
//         <div className={`${fk.className} text-6xl md:text-6xl lg:text-8xl`}>
//           <ColourfulText text="ADNAN" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextWithParticles;


"use client";

import React, { useContext, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";
import { ColourfulText } from "./ColorFulText";
import { useMenuContext } from "../context/MenuContext";
import Lenis from "lenis";
import 'lenis/dist/lenis.css';

const fk = localFont({
  src: "../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
});

gsap.registerPlugin(ScrollTrigger);

const TextWithParticles = () => {
  const text = "HELLO FROM";
  const particleContainerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationContainerRef = useRef<HTMLDivElement | null>(null);
  const { isMenuOpen } = useMenuContext();

  const spanMap = new WeakMap<Element, boolean>();
  let scrollDirection: "up" | "down" = "down";
  let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;

  useEffect(() => {
    // Initialize a new Lenis instance for smooth scrolling
    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => t,
      autoRaf: true,
    });

    // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Convert time from seconds to milliseconds
    });

    // Disable lag smoothing in GSAP to prevent any delay in scroll animations
    gsap.ticker.lagSmoothing(0);

    const scrollHandler = () => {
      const currentY = window.scrollY;
      scrollDirection = currentY > lastScrollY ? "down" : "up";
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", scrollHandler);

    const containerElement = containerRef.current!;
    const animationContainer = animationContainerRef.current!;

    gsap.to(animationContainer, {
      opacity: isMenuOpen ? 0 : 1,
      duration: 1,
      display: isMenuOpen ? "block" : "hidden",
      ease: "power2.out",
    });

    if (containerElement?.querySelector(".text-container")) {
      return () => window.removeEventListener("scroll", scrollHandler);
    }

    const textContainer = document.createElement("div");
    textContainer.className = `text-container ${fk.className}`;
    textContainer.style.cssText = `
      font-size: 6rem;
      text-align: center;
      position: relative;
      display: inline-block;
      white-space: nowrap;
    `;

    Array.from(text).forEach((char) => {
      const span = document.createElement("span");
      span.innerText = char;
      span.style.opacity = "1";
      textContainer.appendChild(span);
    });

    containerElement.appendChild(textContainer);

    const spans = textContainer?.querySelectorAll("span");

    const generateParticles = (char: HTMLElement) => {
      const container = particleContainerRef?.current;
      const rect = char.getBoundingClientRect();

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.style.position = "absolute";
        particle.style.top = `${rect.top + window.scrollY + 80}px`;
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.width = `${gsap.utils.random(3, 7)}px`;
        particle.style.height = `${gsap.utils.random(3, 7)}px`;
        particle.style.background =
          "linear-gradient(45deg, #0ff, #0bb, #08f)";
        particle.style.borderRadius = "50%";
        particle.style.boxShadow = "0 0 10px rgba(0, 255, 255, 0.7)";
        particle.style.pointerEvents = "none";

        container?.appendChild(particle);

        const xOffset =
          scrollDirection === "down"
            ? gsap.utils.random(50, 250)
            : gsap.utils.random(-150, -50);

        gsap.to(particle, {
          x: xOffset,
          y: gsap.utils.random(-50, 50),
          opacity: 0,
          duration: gsap.utils.random(1, 1.5),
          ease: "power.out",
          onComplete: () => {
            container?.removeChild(particle);
          },
        });
      }
    };

    gsap.to(spans, {
      x: 50,
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
            if (progress > index / spans.length && !spanMap.get(char)) {
              generateParticles(char as HTMLElement);
              spanMap.set(char, true);
            }
          });
        },
      },
    });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", scrollHandler);
      containerElement.removeChild(textContainer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy(); // Clean up Lenis
      gsap.ticker.remove(lenis.raf); // Remove Lenis from GSAP ticker
    };
  }, [isMenuOpen]);

  return (
    <div ref={animationContainerRef} className="relative">
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
          height: "100vh",
          backgroundColor: "transparent",
        }}
        className="flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
      >
        <div className={`${fk.className} text-6xl md:text-6xl lg:text-8xl`}>
          <ColourfulText text="ADNAN" />
        </div>
      </div>
    </div>
  );
};

export default TextWithParticles;

