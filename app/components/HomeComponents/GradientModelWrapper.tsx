'use client';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import GradientSection from '../GradientSection';
import dynamic from 'next/dynamic';

// Lazy-load the 3D Scene (optional)
const Scene = dynamic(() => import('./3dmodels/Scene'), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const GradientModelWrapper = () => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    if (!gradientRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: gradientRef.current,
      start: 'top end', // triggers when top of section hits center of viewport
      onEnter: () => setShowScene(true),
      once: true, // Only trigger once
    });

    return () => trigger.kill(); // Clean up
  }, []);

  return (
    <div>
      <div ref={gradientRef}>
        <GradientSection />
      </div>

      {showScene && <Scene />}
    </div>
  );
};

export default GradientModelWrapper;
