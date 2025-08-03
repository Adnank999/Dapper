// "use client";

// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// import { useMenuContext } from "../context/MenuContext";
// import { ColourfulText } from "./ColorfulText";
// import { useLenis } from "lenis/react";

// gsap.registerPlugin(ScrollTrigger);




// const TextWithParticles = () => {
//   const text = "Hi, I am";
//   const containerRef = useRef(null);
//   const colourfulTextRef = useRef(null);
//   const nextTextRef = useRef(null);
//   const { isMenuOpen } = useMenuContext();
//   const lenis = useLenis();
 
//   useEffect(() => {
//     if (!lenis || !containerRef.current) return;

//     const containerElement = containerRef.current;
//     const colourfulText = colourfulTextRef.current;
//     const nextText = nextTextRef.current;

//     lenis.on("scroll", ScrollTrigger.update);
//     gsap.ticker.lagSmoothing(0);

//     let lastScrollY = window.scrollY;
//     let scrollDirection = "down";

//     const scrollHandler = () => {
//       const currentY = window.scrollY;
//       scrollDirection = currentY > lastScrollY ? "down" : "up";
//       lastScrollY = currentY;
//     };

//     window.addEventListener("scroll", scrollHandler);

//     // Initialize text container
//     let textContainer = containerElement.querySelector(".text-container");
//     if (!textContainer) {
//       textContainer = document.createElement("div");
//       textContainer.className = `text-container font-my-font-bold text-highlight`;
//       textContainer.style.cssText = `font-size: 6rem;text-align: center;position: relative;display: inline-block;white-space: nowrap;`;

//       Array.from(text).forEach((char) => {
//         const span = document.createElement("span");
//         span.innerText = char;
//         span.style.opacity = "1";
//         textContainer.appendChild(span);
//       });
//       containerElement.appendChild(textContainer);
//     }

//     const spans = textContainer.querySelectorAll("span");
//     gsap.set([textContainer, colourfulText], { opacity: 0, y: 50 });
//     gsap.set(nextText, { opacity: 0, y: 50, display: "none" });

//     gsap.to([textContainer, colourfulText], {
//       opacity: 1,
//       y: 0,
//       duration: 1,
//       ease: "power2.out",
//     });

//     const mainTimeline = gsap.timeline({
//       scrollTrigger: {
//         trigger: containerElement,
//         start: "top top",
//         end: "+=40%",
//         scrub: true,
//         pin: true,
//         pinSpacing: true,
//       },
//     });

//     mainTimeline.to(spans, {
//       x: 50,
//       opacity: 0,
//       duration: 1,
//       stagger: 0.1,
//       ease: "power2.out",
//     });

//     mainTimeline.to(
//       colourfulText,
//       {
//         opacity: 0,
//         y: -50,
//         duration: 1,
//         ease: "power2.out",
//         onStart: () => gsap.set(colourfulText, { visibility: "visible" }),
//         onComplete: () => {
//           if (scrollDirection === "down") {
//             gsap.set(colourfulText, { visibility: "hidden" });
//           }
//           gsap.set(nextText, { display: "block" });
//         },
//         onReverseComplete: () => {
//           gsap.set(colourfulText, { visibility: "visible", opacity: 1, y: 0 });
//         },
//       },
//       ">"
//     );

//     mainTimeline.to(
//       nextText,
//       {
//         opacity: 1,
//         y: 0,
//         duration: 1,
//         ease: "power2.out",
//       },
//       ">"
//     );

//     return () => {
//       window.removeEventListener("scroll", scrollHandler);
//       textContainer?.remove();
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//       lenis.off("scroll", ScrollTrigger.update);
//     };
//   }, [isMenuOpen, lenis]);

//   return (
//     <div className="relative w-full">
//       <div
//         ref={containerRef}
//         style={{ height: "100vh", backgroundColor: "transparent" }}
//         className="leading-5 flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
//       >
//         <div
//           ref={colourfulTextRef}
//           className="font-my-font-bold mt-10 lg:mt-0 text-6xl md:text-7xl lg:text-8xl"
//           style={{ opacity: 0 }}
//         >
//           <ColourfulText text="ADNAN" />
//         </div>
//         <div
//           ref={nextTextRef}
//           className="font-my-font-bold px-10 absolute text-shadow-red text-9xl"
//           style={{ opacity: 0 }}
//         >
//           <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger tracking-wider">
//             A Fullstack Developer
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(TextWithParticles);

"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMenuContext } from "../context/MenuContext";
import { ColourfulText } from "./ColorfulText";
import { useLenis } from "lenis/react";

gsap.registerPlugin(ScrollTrigger);

const TextWithParticles = () => {
  const text = "Hi, I am";
  const containerRef = useRef(null);
  const colourfulTextRef = useRef(null);
  const nextTextRef = useRef(null);
  const textContainerRef = useRef(null);
  const animationInitialized = useRef(false);
  const { isMenuOpen } = useMenuContext();
  const lenis = useLenis();

  // Memoized scroll handler
  const scrollHandler = useCallback(() => {
    // Removed scroll direction tracking as it's not essential
  }, []);

  useEffect(() => {
    if (!lenis || !containerRef.current || animationInitialized.current) return;

    const containerElement = containerRef.current;
    const colourfulText = colourfulTextRef.current;
    const nextText = nextTextRef.current;

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    // Pre-create and position text container to avoid layout shifts
    let textContainer = textContainerRef.current;
    if (!textContainer) {
      textContainer = document.createElement("div");
      textContainer.className = `text-container font-my-font-bold text-highlight`;
      
      // Set fixed dimensions to prevent layout shift
      textContainer.style.cssText = `
        font-size: 6rem;
        text-align: center;
        position: relative;
        display: inline-block;
        white-space: nowrap;
        min-height: 96px;
        min-width: 300px;
        will-change: transform, opacity;
      `;

      // Create spans with pre-allocated space
      Array.from(text).forEach((char, index) => {
        const span = document.createElement("span");
        span.innerText = char === ' ' ? '\u00A0' : char; // Non-breaking space
        span.style.cssText = `
          display: inline-block;
          opacity: 1;
          will-change: transform, opacity;
          min-width: ${char === ' ' ? '1rem' : '0.5rem'};
        `;
        textContainer.appendChild(span);
      });
      
      containerElement.appendChild(textContainer);
      textContainerRef.current = textContainer;
    }

    const spans = textContainer.querySelectorAll("span");

    // Set initial states without causing layout shifts
    gsap.set([textContainer, colourfulText], { 
      opacity: 0, 
      y: 50,
      visibility: "visible" // Ensure elements are visible but transparent
    });
    
    gsap.set(nextText, { 
      opacity: 0, 
      y: 50, 
      visibility: "hidden" // Use visibility instead of display
    });

    // Initial animation
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
        scrub: 1, // Smoother scrubbing
        pin: true,
        pinSpacing: true,
        anticipatePin: 1, // Prevent layout shifts during pinning
        refreshPriority: -1,
      },
    });

    mainTimeline.to(spans, {
      x: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.05, // Reduced stagger for smoother animation
      ease: "power2.out",
    });

    mainTimeline.to(
      colourfulText,
      {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(nextText, { visibility: "visible" });
        },
        onReverseComplete: () => {
          gsap.set(colourfulText, { opacity: 1, y: 0 });
          gsap.set(nextText, { visibility: "hidden" });
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

    animationInitialized.current = true;

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.off("scroll", ScrollTrigger.update);
      animationInitialized.current = false;
    };
  }, [isMenuOpen, lenis, scrollHandler]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="leading-5 flex flex-col-reverse md:flex-row-reverse lg:flex-row-reverse lg:gap-8 justify-center items-center"
        style={{ 
          height: "100vh", 
          backgroundColor: "transparent",
          contain: "layout style paint" // CSS containment for performance
        }}
      >
        {/* Pre-allocated space for text elements */}
        <div
          ref={colourfulTextRef}
          className="font-my-font-bold mt-10 lg:mt-0 text-6xl md:text-7xl lg:text-8xl"
          style={{ 
            opacity: 0,
            minHeight: "96px", // Reserve space for lg:text-8xl
            minWidth: "400px",
            willChange: "transform, opacity"
          }}
        >
          <ColourfulText text="ADNAN" />
        </div>
        
        <div
          ref={nextTextRef}
          className="font-my-font-bold px-10 absolute text-shadow-red text-9xl"
          style={{ 
            opacity: 0,
            visibility: "hidden",
            minHeight: "120px", // Reserve space for text-8xl
            willChange: "transform, opacity"
          }}
        >
          <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger tracking-wider">
            A Fullstack Developer
          </h2>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TextWithParticles);
