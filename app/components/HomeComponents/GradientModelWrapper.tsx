'use client';
import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import GradientSection from '../GradientSection';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./3dmodels/Scene'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-10 flex items-center justify-center text-white">Loading 3D...</div>,
});

gsap.registerPlugin(ScrollTrigger);

const GradientModelWrapper = () => {
  const gradientRef = useRef<HTMLDivElement>(null);
  const sceneWrapperRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!gradientRef.current || !sceneWrapperRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: gradientRef.current,
      start: 'top center',
      onEnter: () => {
        setVisible(true);
        gsap.to(sceneWrapperRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      },
      once: true,
    });

    return () => trigger.kill();
  }, []);

  return (
    <div>
      <div ref={gradientRef}>
        <GradientSection />
      </div>

      {/* Always mount Scene early but hidden */}
      <div
        ref={sceneWrapperRef}
        style={{
          opacity: 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        <Scene />
      </div>
    </div>
  );
};

export default GradientModelWrapper;
