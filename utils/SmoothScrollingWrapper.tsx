'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect, useRef } from 'react';

type Props = {
  children: ReactNode;
};

const SmoothScrollingWrapper = ({ children }: Props) => {
  const lenisRef = useRef<any>(null);

useEffect(() => {
  let rafId: number;

  const animate = (time: number) => {
    lenisRef.current?.lenis?.raf(time);
    rafId = requestAnimationFrame(animate); // ✅ repeat every frame
  };

  animate(0); // ✅ start the loop

  return () => cancelAnimationFrame(rafId);
}, []);

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        duration: 0.5,
        easing: (t: number) => t,
        autoRaf: false, // ✅ You control the loop
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default SmoothScrollingWrapper;
