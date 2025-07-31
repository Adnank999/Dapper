// "use client";

// import React, { useContext, useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import localFont from "next/font/local";
// import { useMenuContext } from "../context/MenuContext";
// import Lenis from "lenis";
// import "lenis/dist/lenis.css";
// import { ColourfulText } from "./ColorfulText";
// import { useLenis } from "lenis/react";

// const fk = localFont({
//   src: "../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
// });

// gsap.registerPlugin(ScrollTrigger);

// const TextWithParticles = () => {
//   const text = "Hi, I am";
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const animationContainerRef = useRef<HTMLDivElement | null>(null);
//   const colourfulTextRef = useRef<HTMLDivElement | null>(null);
//   const nextTextRef = useRef<HTMLDivElement | null>(null);
//   const { isMenuOpen } = useMenuContext();
//   const lenis = useLenis();
//   let scrollDirection: "up" | "down" = "down";
//   let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;





// useEffect(() => {
//   if (!lenis) return;

//   // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
//   lenis.on("scroll", ScrollTrigger.update);
//   gsap.ticker.lagSmoothing(0);

//   const scrollHandler = () => {
//     const currentY = window.scrollY;
//     scrollDirection = currentY > lastScrollY ? "down" : "up";
//     lastScrollY = currentY;
//   };

//   window.addEventListener("scroll", scrollHandler);

//   const containerElement = containerRef.current!;
//   const colourfulText = colourfulTextRef.current!;
//   const nextText = nextTextRef.current!;

//   // Set initial state for nextText
//   gsap.set(nextText, {
//     opacity: 0,
//     y: 50,
//     display: "none",
//   });

//   // Check if `text-container` already exists
//   let textContainer = containerElement.querySelector(".text-container");
//   if (!textContainer) {
//     textContainer = document.createElement("div");
//     textContainer.className = `text-container ${fk.className} text-highlight`;
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
//   }

//   const spans = textContainer.querySelectorAll("span");

//   // Set the initial state for both elements
//   gsap.set([textContainer, colourfulText], {
//     opacity: 0,
//     y: 50,
//   });

//   // Animate both elements to fade in and move to their original position
//   gsap.to([textContainer, colourfulText], {
//     opacity: 1,
//     y: 0,
//     duration: 1,
//     ease: "power2.out",
//   });

//   // Main timeline for scroll-based animations
//   const mainTimeline = gsap.timeline({
//     scrollTrigger: {
//       trigger: containerElement,
//       start: "top top", // Start animation when container reaches the top of the viewport
//       end: "+=40%", // Extend scroll distance for the animation
//       scrub: true, // Smooth animation based on scroll progress
//       pin: true, // Pin the container during the animation
//       pinSpacing: true,
//     },
//   });

//   // Fade out spans one by one
//   mainTimeline.to(spans, {
//     x: 50, // Move spans to the right
//     opacity: 0, // Fade out spans
//     duration: 1,
//     stagger: 0.1, // Stagger animation for each span
//     ease: "power2.out",
//   });

//   // Fade out colourfulText after spans fade out
//   mainTimeline.to(
//     colourfulText,
//     {
//       opacity: 0,
//       y: -50, // Move up while fading out
//       duration: 1,
//       ease: "power2.out",
//       onStart: () => {
//         gsap.set(colourfulText, { visibility: "visible" });
//       },
//       onComplete: () => {
//         // When forward animation completes
//         if (scrollDirection === "down") {
//           gsap.set(colourfulText, { visibility: "hidden" });
//         }
//         gsap.set(nextText, { display: "block" });
//       },
//       onReverseComplete: () => {
//         // When reverse animation completes
//         gsap.set(colourfulText, {
//           visibility: "visible",
//           opacity: 1,
//           y: 0,
//         });
//       },
//     },
//     ">" // Start after spans fade out
//   );

//   // Fade in nextText after colourfulText fades out
//   mainTimeline.to(
//     nextText,
//     {
//       opacity: 1,
//       y: 0,
//       duration: 1,
//       ease: "power2.out",
//     },
//     ">" // Start after colourfulText fades out
//   );

//   // Cleanup function
//   return () => {
//     window.removeEventListener("scroll", scrollHandler);
//     containerElement.removeChild(textContainer);
//     ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     lenis.off("scroll", ScrollTrigger.update);
//   };
// }, [isMenuOpen, lenis]);


//   return (
//     <div ref={animationContainerRef} className="relative w-full">
//       <div
//         ref={containerRef}
//         style={{
//           height: "100vh",
//           backgroundColor: "transparent",
//         }}
//         className="leading-5 flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
//       >
//         <div
//           ref={colourfulTextRef}
//           className={`${fk.className} mt-10 lg:mt-0 text-6xl md:text-7xl lg:text-8xl`}
//           style={{
//             opacity: 0,
//           }}
//         >
//           <ColourfulText text="ADNAN" />
//         </div>

//         {/* New text component that will appear after scrolling */}
//         <div
//           ref={nextTextRef}
//           className={`${fk.className} px-10 absolute text-shadow-red text-9xl`}
//           style={{
//             opacity: 0,
//           }}
//         >
//           <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger  tracking-wider">
//             A Fullstack Developer
//           </h2>
//           {/* You can replace this with another component if needed */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TextWithParticles;




"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";
import { useMenuContext } from "../context/MenuContext";
import { ColourfulText } from "./ColorfulText";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const fk = localFont({
  src: "../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
});


const TextWithParticles = () => {
  const text = "Hi, I am";
  const containerRef = useRef(null);
  const colourfulTextRef = useRef(null);
  const nextTextRef = useRef(null);
  const { isMenuOpen } = useMenuContext();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis || !containerRef.current) return;

    const containerElement = containerRef.current;
    const colourfulText = colourfulTextRef.current;
    const nextText = nextTextRef.current;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    let lastScrollY = window.scrollY;
    let scrollDirection = "down";

    const scrollHandler = () => {
      const currentY = window.scrollY;
      scrollDirection = currentY > lastScrollY ? "down" : "up";
      lastScrollY = currentY;
    };

    window.addEventListener("scroll", scrollHandler);

    // Initialize text container
    let textContainer = containerElement.querySelector(".text-container");
    if (!textContainer) {
      textContainer = document.createElement("div");
      textContainer.className = `text-container ${fk.className} text-highlight`;
      textContainer.style.cssText = `font-size: 6rem;text-align: center;position: relative;display: inline-block;white-space: nowrap;`;

      Array.from(text).forEach((char) => {
        const span = document.createElement("span");
        span.innerText = char;
        span.style.opacity = "1";
        textContainer.appendChild(span);
      });
      containerElement.appendChild(textContainer);
    }

    const spans = textContainer.querySelectorAll("span");
    gsap.set([textContainer, colourfulText], { opacity: 0, y: 50 });
    gsap.set(nextText, { opacity: 0, y: 50, display: "none" });

    gsap.to([textContainer, colourfulText], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    });

    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: containerElement,
        start: "top top",
        end: "+=40%",
        scrub: true,
        pin: true,
        pinSpacing: true,
      },
    });

    mainTimeline.to(spans, {
      x: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power2.out",
    });

    mainTimeline.to(
      colourfulText,
      {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.out",
        onStart: () => gsap.set(colourfulText, { visibility: "visible" }),
        onComplete: () => {
          if (scrollDirection === "down") {
            gsap.set(colourfulText, { visibility: "hidden" });
          }
          gsap.set(nextText, { display: "block" });
        },
        onReverseComplete: () => {
          gsap.set(colourfulText, { visibility: "visible", opacity: 1, y: 0 });
        },
      },
      ">"
    );

    mainTimeline.to(
      nextText,
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      ">"
    );

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      textContainer?.remove();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [isMenuOpen, lenis]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        style={{ height: "100vh", backgroundColor: "transparent" }}
        className="leading-5 flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
      >
        <div
          ref={colourfulTextRef}
          className={`${fk.className} mt-10 lg:mt-0 text-6xl md:text-7xl lg:text-8xl`}
          style={{ opacity: 0 }}
        >
          <ColourfulText text="ADNAN" />
        </div>
        <div
          ref={nextTextRef}
          className={`${fk.className} px-10 absolute text-shadow-red text-9xl`}
          style={{ opacity: 0 }}
        >
          <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger tracking-wider">
            A Fullstack Developer
          </h2>
        </div>
      </div>
    </div>
  );
};

export default TextWithParticles;

