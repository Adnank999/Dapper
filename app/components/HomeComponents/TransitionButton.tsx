// src/TransitionButton.tsx
'use client';
import React, { useEffect, ReactNode, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TransitionButton.css'; // Import the CSS file

gsap.registerPlugin(ScrollTrigger);

interface TransitionButtonProps {
  children: ReactNode; // Accept children as prop
}

const TransitionButton: React.FC<TransitionButtonProps> = ({ children }) => {
  const textRef = useRef<HTMLDivElement | null>(null); // Ref for the text element

  useEffect(() => {
    const textElement = textRef.current;

    if (textElement) {
      gsap.fromTo(textElement, { opacity: 0 }, {
        opacity: 1,
        scrollTrigger: {
          trigger: textElement,
          start: '+=20', // Trigger when the top of the element hits the bottom of the viewport
          end: 'top center', // End when the top of the element hits the center of the viewport
          scrub: true,
          toggleActions: 'play none none reverse',
        },
      });
    }

    // Cleanup function to kill the ScrollTrigger instance
    return () => {
      if (textElement) {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="mt-4 w-full max-w-md">
        <div ref={textRef} className="fade-transition">
          <p className="text-center p-4 rounded-lg shadow-md">{children}</p>
        </div>
      </div>
    </div>
  );
};

export default TransitionButton;
