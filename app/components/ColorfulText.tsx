"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export function ColourfulText({ text }: { text: string }) {
  const colors = [
    "rgb(131, 179, 32)",
    "rgb(47, 195, 106)",
    "rgb(42, 169, 210)",
    "rgb(4, 112, 202)",
    "rgb(107, 10, 255)",
    "rgb(183, 0, 218)",
    "rgb(218, 0, 171)",
    "rgb(230, 64, 92)",
    "rgb(232, 98, 63)",
    "rgb(249, 129, 47)",
  ];

  const [currentColors, setCurrentColors] = React.useState(colors);
  const [count, setCount] = React.useState(0);
  const textRef = useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const interval = setInterval(() => {
      const shuffled = [...colors].sort(() => Math.random() - 0.5);
      setCurrentColors(shuffled);
      setCount((prev) => prev + 1);
    }, 5000);

    const element = textRef.current;

    if (element) {
      gsap.to(element, {
        opacity: 0,
        duration: 0.5,
        scrollTrigger: {
          trigger: element,
          start: "top top", // Animation starts when 80% of the viewport height is reached
          end: "botom 80%", // Animation ends when 20% of the viewport height is reached
          scrub: true, // Smooth fading effect
          // markers: true
        },
      });
    }

    return () => {
      clearInterval(interval);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={textRef}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${count}-${index}`}
          initial={{
            y: 0,
          }}
          animate={{
            color: currentColors[index % currentColors.length],
            y: [0, -3, 0],
            scale: [1, 1.01, 1],
            filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 0.5,
            delay: index * 0.05,
          }}
          className="inline-block whitespace-pre tracking-tight"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}
