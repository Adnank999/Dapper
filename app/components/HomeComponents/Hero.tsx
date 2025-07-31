'use client'; 

import dynamic from 'next/dynamic';
import LazyWrapper from './LazyWrapper'; 



export default function Hero() {
  console.log("hero rendering")
  return (
    <div className="w-full space-y-16"> {/* Increased spacing */}
      
      <LazyWrapper 
        delay={0}
        componentName="Navigation"
        importFunction={() => import('../NavHeroContainer')}
        rootMargin="0px"
      />

      <LazyWrapper 
        delay={200}
        componentName="TextWithParticles"
        importFunction={() => import('../TextWithParticles')}
        rootMargin="0px" // Must be 200px INTO the viewport
      />

      <LazyWrapper 
        delay={500}
        componentName="GlowingEffect"
        className="max-w-4xl mx-auto"
        importFunction={() => import('./glowing-effectDemo').then(mod => ({ default: mod.GlowingEffectDemo }))}
        rootMargin="-320px" 
      />
    </div>
  );
}

