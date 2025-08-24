// "use client"

// import type React from "react"
// import { useState, useEffect, useCallback, useRef } from "react"

// interface Character {
//   char: string
//   x: number
//   y: number
//   speed: number
// }

// class TextScramble {
//   el: HTMLElement
//   chars: string
//   queue: Array<{
//     from: string
//     to: string
//     start: number
//     end: number
//     char?: string
//   }>
//   frame: number
//   frameRequest: number
//   resolve: (value: void | PromiseLike<void>) => void

//   constructor(el: HTMLElement) {
//     this.el = el
//     this.chars = '!<>-_\\/[]{}—=+*^?#'
//     this.queue = []
//     this.frame = 0
//     this.frameRequest = 0
//     this.resolve = () => {}
//     this.update = this.update.bind(this)
//   }

//   setText(newText: string) {
//     const oldText = this.el.innerText
//     const length = Math.max(oldText.length, newText.length)
//     const promise = new Promise<void>((resolve) => this.resolve = resolve)
//     this.queue = []

//     for (let i = 0; i < length; i++) {
//       const from = oldText[i] || ''
//       const to = newText[i] || ''
//       const start = Math.floor(Math.random() * 40)
//       const end = start + Math.floor(Math.random() * 40)
//       this.queue.push({ from, to, start, end })
//     }

//     cancelAnimationFrame(this.frameRequest)
//     this.frame = 0
//     this.update()
//     return promise
//   }

//   update() {
//     let output = ''
//     let complete = 0

//     for (let i = 0, n = this.queue.length; i < n; i++) {
//       let { from, to, start, end, char } = this.queue[i]
//       if (this.frame >= end) {
//         complete++
//         output += to
//       } else if (this.frame >= start) {
//         if (!char || Math.random() < 0.28) {
//           char = this.chars[Math.floor(Math.random() * this.chars.length)]
//           this.queue[i].char = char
//         }
//         output += `<span class="dud">${char}</span>`
//       } else {
//         output += from
//       }
//     }

//     this.el.innerHTML = output
//     if (complete === this.queue.length) {
//       this.resolve()
//     } else {
//       this.frameRequest = requestAnimationFrame(this.update)
//       this.frame++
//     }
//   }
// }

// const ScrambledTitle: React.FC = () => {
//   const elementRef = useRef<HTMLHeadingElement>(null)
//   const scramblerRef = useRef<TextScramble | null>(null)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     if (elementRef.current && !scramblerRef.current) {
//       scramblerRef.current = new TextScramble(elementRef.current)
//       setMounted(true)
//     }
//   }, [])
// "The best websites aren’t built with code. They’re built with empathy."
//   useEffect(() => {
//     if (mounted && scramblerRef.current) {
//       const phrases = [

//         'The Best Technologies',
//         'aren\’t built with code.' ,
//         'They’re built with',
//         'Empathy and Soul',
//         'Adnan,'

//       ]

//       let counter = 0
//       const next = () => {
//         if (scramblerRef.current) {
//           scramblerRef.current.setText(phrases[counter]).then(() => {
//             setTimeout(next, 2000)
//           })
//           counter = (counter + 1) % phrases.length
//         }
//       }

//       next()
//     }
//   }, [mounted])

//   return (
//     <h1
//       ref={elementRef}
//       className="text-white !font-clyra text-center text-8xl  font-bold tracking-wider justify-center"
//       // style={{ fontFamily: 'monospace' }}
//     >
//       ZaxzzzzzazzzzzZZZ
//     </h1>
//   )
// }

// const RainingLetters: React.FC = () => {
//   console.log("raing letter rendering")
//   const [characters, setCharacters] = useState<Character[]>([])
//   const [activeIndices, setActiveIndices] = useState<Set<number>>(new Set())

//   const createCharacters = useCallback(() => {
//     const allChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"
//     const charCount = 300
//     const newCharacters: Character[] = []

//     for (let i = 0; i < charCount; i++) {
//       newCharacters.push({
//         char: allChars[Math.floor(Math.random() * allChars.length)],
//         x: Math.random() * 100,
//         y: Math.random() * 100,
//         speed: 0.1 + Math.random() * 0.3,
//       })
//     }

//     return newCharacters
//   }, [])

//   useEffect(() => {
//     setCharacters(createCharacters())
//   }, [createCharacters])

//   useEffect(() => {
//     const updateActiveIndices = () => {
//       const newActiveIndices = new Set<number>()
//       const numActive = Math.floor(Math.random() * 3) + 3
//       for (let i = 0; i < numActive; i++) {
//         newActiveIndices.add(Math.floor(Math.random() * characters.length))
//       }
//       setActiveIndices(newActiveIndices)
//     }

//     const flickerInterval = setInterval(updateActiveIndices, 50)
//     return () => clearInterval(flickerInterval)
//   }, [characters.length])

//   useEffect(() => {
//     let animationFrameId: number

//     const updatePositions = () => {
//       setCharacters(prevChars =>
//         prevChars.map(char => ({
//           ...char,
//           y: char.y + char.speed,
//           ...(char.y >= 100 && {
//             y: -5,
//             x: Math.random() * 100,
//             char: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?"[
//               Math.floor(Math.random() * "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?".length)
//             ],
//           }),
//         }))
//       )
//       animationFrameId = requestAnimationFrame(updatePositions)
//     }

//     animationFrameId = requestAnimationFrame(updatePositions)
//     return () => cancelAnimationFrame(animationFrameId)
//   }, [])

//   return (
//     <div className="relative w-full h-screen bg-black overflow-hidden">
//       {/* Title */}
//       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
//         <ScrambledTitle />
//       </div>

//       {/* Raining Characters */}
//       {characters.map((char, index) => (
//         <span
//           key={index}
//           className={`absolute text-xs transition-colors duration-100 ${
//             activeIndices.has(index)
//               ? "text-[#00ff00] text-base scale-125 z-10 font-bold animate-pulse"
//               : "text-slate-600 font-light"
//           }`}
//           style={{
//             left: `${char.x}%`,
//             top: `${char.y}%`,
//             transform: `translate(-50%, -50%) ${activeIndices.has(index) ? 'scale(1.25)' : 'scale(1)'}`,
//             textShadow: activeIndices.has(index)
//               ? '0 0 8px rgba(255,255,255,0.8), 0 0 12px rgba(255,255,255,0.4)'
//               : 'none',
//             opacity: activeIndices.has(index) ? 1 : 0.4,
//             transition: 'color 0.1s, transform 0.1s, text-shadow 0.1s',
//             willChange: 'transform, top',
//             fontSize: '1.8rem'
//           }}
//         >
//           {char.char}
//         </span>
//       ))}

//       <style jsx global>{`
//         .dud {
//           color: #0f0;
//           opacity: 0.7;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default RainingLetters

"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import ScrambledTitle from "./ScrambleTittle";
import useIsMobile from "@/hooks/useIsMobile";

const MemoizedScrambledTitle = memo(ScrambledTitle);

const RainingLetters: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charElements = useRef<HTMLElement[]>([]);

  const allChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const charCount = 300;

  const isMobile = useIsMobile();

  console.log("Raing letter rendering");
  // useEffect(() => {
  //   const container = containerRef.current
  //   if (!container) return

  //   const elements: HTMLElement[] = []

  //   for (let i = 0; i < charCount; i++) {
  //     const span = document.createElement("span")
  //     span.textContent = allChars[Math.floor(Math.random() * allChars.length)]
  //     span.className = "absolute text-slate-600 font-light text-xs"
  //     span.style.left = `${Math.random() * 100}%`
  //     span.style.top = `${Math.random() * 100}%`
  //     span.style.transform = "translate(-50%, -50%)"
  //     container.appendChild(span)
  //     elements.push(span)
  //   }

  //   charElements.current = elements

  //   let animationFrameId: number
  //   const speeds = elements.map(() => 0.05 + Math.random() * 0.3)

  //   const animate = () => {
  //     elements.forEach((el, i) => {
  //       let top = parseFloat(el.style.top || "0")
  //       top += speeds[i]
  //       if (top >= 100) {
  //         top = -5
  //         el.textContent = allChars[Math.floor(Math.random() * allChars.length)]
  //         el.style.left = `${Math.random() * 100}%`
  //       }
  //       el.style.top = `${top}%`

  //       // Flicker effect
  //       if (Math.random() < 0.03) {
  //         el.className = "absolute text-[#00ff00] text-base font-bold animate-pulse"
  //       } else {
  //         el.className = "absolute text-slate-600 font-light text-xs md:text-lg lg:text-xl"
  //       }
  //     })

  //     animationFrameId = requestAnimationFrame(animate)
  //   }

  //   animate()

  //   return () => {
  //     cancelAnimationFrame(animationFrameId)
  //     elements.forEach(el => container.removeChild(el))
  //   }
  // }, [])

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements: HTMLElement[] = [];

    for (let i = 0; i < charCount; i++) {
      const span = document.createElement("span");
      span.textContent = allChars[Math.floor(Math.random() * allChars.length)];
      span.className = "absolute text-slate-600 font-light text-xs";
      span.style.left = `${Math.random() * 100}%`;
      span.style.top = `${Math.random() * 100}%`;
      span.style.transform = "translate(-50%, -50%)";
      container.appendChild(span);
      elements.push(span);
    }

    charElements.current = elements;

    let animationFrameId: number;
    const speeds = elements.map(() => 0.05 + Math.random() * 0.3);
    const greenTimers = elements.map(() => ({
      isGreen: false,
      timer: 0,
      duration: 0,
    }));

    const animate = () => {
      elements.forEach((el, i) => {
        let top = parseFloat(el.style.top || "0");
        top += speeds[i];
        if (top >= 100) {
          top = -5;
          el.textContent =
            allChars[Math.floor(Math.random() * allChars.length)];
          el.style.left = `${Math.random() * 100}%`;
          greenTimers[i].isGreen = false;
          greenTimers[i].timer = 0;
        }
        el.style.top = `${top}%`;

        // Green duration control
        if (!greenTimers[i].isGreen) {
          if (isMobile ? Math.random() < 0.009 : Math.random() < 0.03) {
            greenTimers[i].isGreen = true;
            greenTimers[i].timer = 0;
            greenTimers[i].duration = isMobile
              ? 5 + Math.random() * 5
              : 10 + Math.random() * 10;
          }
        } else {
          greenTimers[i].timer++;
          if (greenTimers[i].timer >= greenTimers[i].duration) {
            greenTimers[i].isGreen = false;
            greenTimers[i].timer = 0;
          }
        }

        if (greenTimers[i].isGreen) {
          el.className =
            "absolute text-[#00ff00] text-[10px] md:text-sm  font-bold animate-pulse";
        } else {
          el.className =
            "absolute text-slate-600 font-light text-[10px] md:text-sm ";
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      elements.forEach((el) => container.removeChild(el));
    };
  }, []);

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden"
      ref={containerRef}
    >
      {/* Title */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <MemoizedScrambledTitle />
      </div>

      <style jsx global>{`
        .dud {
          color: #0f0;
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default RainingLetters;
