// "use client";

// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { ColourfulText } from "../ColorfulText";

// gsap.registerPlugin(ScrollTrigger);

// const Intro: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const h1Ref = useRef<HTMLHeadingElement>(null);
//   const nameRef = useRef<HTMLSpanElement>(null);
//   const nextTextRef = useRef<HTMLDivElement>(null);
//   const textCharsRef = useRef<HTMLSpanElement[]>([]);

//   useEffect(() => {
//     if (!containerRef.current || !h1Ref.current) return;

//     const h1Element = h1Ref.current;
//     const nameElement = nameRef.current;
//     const nextTextElement = nextTextRef.current;

//     // Remove CSS animations and set initial state
//     h1Element.classList.remove('opacity-0', 'translate-y-12', 'animate-slide-up-fade');
//     if (nameElement) {
//       nameElement.classList.remove('opacity-0', 'animate-slide-up-fade-delay');
//     }

//     // Split "Hi, I am " text into character spans
//     const textContent = "Hi, I am ";
//     const textNode = Array.from(h1Element.childNodes).find(
//       node => node.nodeType === Node.TEXT_NODE && node.textContent?.includes("Hi, I am")
//     );

//     if (textNode) {
//       const fragment = document.createDocumentFragment();
      
//       textContent.split('').forEach((char, index) => {
//         const span = document.createElement('span');
//         span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
//         span.className = 'inline-block';
//         span.style.willChange = 'transform, opacity';
//         textCharsRef.current[index] = span;
//         fragment.appendChild(span);
//       });
      
//       textNode.parentNode?.replaceChild(fragment, textNode);
//     }

//     // Set initial states
//     gsap.set(h1Element, { opacity: 0, y: 50 });
//     gsap.set(nameElement, { opacity: 0, y: 50 });
//     gsap.set(nextTextElement, { 
//       opacity: 0, 
//       y: 400,
//       scale: 0.5, // Start smaller for scale effect
//       visibility: "visible"
//     });

//     // Initial entrance animation
//     const entranceTimeline = gsap.timeline();
    
//     entranceTimeline.to(h1Element, {
//       opacity: 1,
//       y: 0,
//       duration: 1,
//       ease: "power2.out",
//     });

//     entranceTimeline.to(nameElement, {
//       opacity: 1,
//       y: 0,
//       duration: 1,
//       ease: "power2.out",
//     }, "-=0.7");

//     // Scroll-triggered character fade animation
//     const scrollTimeline = gsap.timeline({
//       scrollTrigger: {
//         trigger: containerRef.current,
//         start: "top top",
//         end: "bottom center",
//         markers: true,
//         scrub: 1, // Smooth scroll-linked animation
//         refreshPriority: -1,
//       },
//     });

//     // Animate each character to fade out
//     textCharsRef.current.forEach((char, index) => {
//       if (char) {
//         scrollTimeline.to(char, {
//           opacity: 0,
//           y: -100,
//           duration: 0.3,
//           ease: "power2.out",
//         }, index * 0.05); // Stagger each character by 0.05s
//       }
//     });

//     // Animate the name to fade out after the text
//     if (nameElement) {
//       scrollTimeline.to(nameElement, {
//         opacity: 0,
//         y: -50,
//         duration: 1,
//         ease: "power2.out",
//       }, textCharsRef.current.length * 0.05 + 0.2);
//     }

//     // Add a gap/pause in the timeline
//     const nameEndTime = textCharsRef.current.length * 0.05 + 1.2; // When name animation ends
    
//     const nextTextStartTime = nameEndTime - 2; // When next text starts

//     // Animate the next text to fade in with scale effect after the gap
//     if (nextTextElement) {
//       scrollTimeline.to(nextTextElement, {
//         opacity: 1,
//         y: 300,
//         scale: 1, // Scale up to normal size
//         duration: 2,
//         ease: "expo.in", // Bouncy scale effect
//       }, nextTextStartTime);
//     }

//     // Cleanup
//     return () => {
//       ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
//     };
//   }, []);

//   return (
//     <div 
//       ref={containerRef}
//       className=" flex justify-center items-center h-screen w-full relative"
//     >
//       <h1 
//         ref={h1Ref}
//         className="leading-5 text-highlight text-3xl md:text-5xl lg:text-8xl font-bold !font-my-font-bold text-center m-0"
//       >
//         Hi, I am{" "}
//         <span 
//           ref={nameRef}
//           className="inline-block"
//         >
//           <ColourfulText text="ADNAN" />
//         </span>
//       </h1>
      
//       <div
//         ref={nextTextRef}
//         className="font-my-font-bold px-10 absolute text-shadow-red text-9xl"
//         style={{ 
//           opacity: 0,
//           visibility: "visible",
//           minHeight: "120px",
//           willChange: "transform, opacity, scale"
//         }}
//       >
//         <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger tracking-wider">
//           A Fullstack Developer
//         </h2>
//       </div>
//     </div>
//   );
// };

// export default React.memo(Intro);



"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ColourfulText } from "../ColorfulText";

gsap.registerPlugin(ScrollTrigger);

const Intro: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const nextTextRef = useRef<HTMLDivElement>(null);
  const textCharsRef = useRef<HTMLSpanElement[]>([]);
  const textGroupRef = useRef<HTMLSpanElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !h1Ref.current) return;

    const h1Element = h1Ref.current;
    const nameElement = nameRef.current;
    const nextTextElement = nextTextRef.current;

    // Create a wrapper span for all text characters
    const textGroupSpan = document.createElement('span');
    textGroupSpan.className = 'inline-block';
    textGroupRef.current = textGroupSpan;

    // Create animated character spans
    const textContent = " Hi, I am ";
    
    textContent.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'inline-block';
      span.style.willChange = 'transform, opacity';
      textCharsRef.current[index] = span;
      textGroupSpan.appendChild(span);
    });
    
    // Clear h1 and add the text group
    h1Element.innerHTML = '';
    h1Element.appendChild(textGroupSpan);
    
    // Add space and name span
    if (nameElement) {
      h1Element.appendChild(document.createTextNode(' '));
      h1Element.appendChild(nameElement);
    }

    // Set initial states using GSAP instead of CSS
    gsap.set([textGroupSpan, nameElement], { 
      opacity: 0, 
      y: 100 
    });
    
    gsap.set(nextTextElement, { 
      opacity: 0, 
      y: 400,
      scale: 0.5,
      visibility: "visible"
    });

    // Show the component
    setIsReady(true);

    // Entrance animations using GSAP
    const entranceTl = gsap.timeline();
    
    // Both text and name appear together from bottom
    entranceTl.to([textGroupSpan, nameElement], {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power2.out",
    }, 0.2);

    // Wait for entrance animations to complete before setting up scroll triggers
    setTimeout(() => {
      // Create individual ScrollTriggers for each character
      textCharsRef.current.forEach((char, index) => {
        if (char) {
          gsap.to(char, {
            opacity: 0,
            y: -100,
            duration: 0.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: containerRef.current,
              start: `top+=${index * 20} top`,
              end: `top+=${index * 20} top`,
              scrub: 1,
              markers: false,
            }
          });
        }
      });

      // Name animation - this should now work properly
      if (nameElement) {
        gsap.to(nameElement, {
          opacity: 0,
          y: -50,
          duration: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=200 top",
            end: "top+=400 top",
            scrub: 1,
            markers: false,
          }
        });
      }

      // Next text animation
      if (nextTextElement) {
        gsap.to(nextTextElement, {
          opacity: 1,
          y: 300,
          scale: 1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top+=300 top",
            end: "bottom center",
            scrub: 1,
            markers: false,
          }
        });
      }
    }, 1400); // Reduced timeout since we're using GSAP for entrance

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex justify-center items-center h-screen w-full relative"
      style={{ opacity: isReady ? 1 : 0 }}
    >
      <h1 
        ref={h1Ref}
        className="leading-5 text-highlight text-3xl md:text-5xl lg:text-8xl font-bold !font-my-font-bold text-center m-0"
      >
        <span 
          ref={nameRef}
          className="inline-block"
        >
          <ColourfulText text="ADNAN" />
        </span>
      </h1>
      
      <div
        ref={nextTextRef}
        className="font-my-font-bold px-10 absolute text-shadow-red text-9xl"
        style={{ 
          opacity: 0,
          visibility: "visible",
          minHeight: "120px",
          willChange: "transform, opacity, scale"
        }}
      >
        <h2 className="text-[#fa1e16] text-5xl md:text-6xl lg:text-8xl text-start lg:text-center !font-stranger tracking-wider">
          A Fullstack Developer
        </h2>
      </div>
    </div>
  );
};

export default React.memo(Intro);


