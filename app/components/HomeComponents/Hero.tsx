"use client";

import dynamic from "next/dynamic";
import LazyWrapper from "./LazyWrapper";

// const Scene = dynamic(() => import("./3dmodels/Scene"), { ssr: false });

export default function Hero() {
  return (
    <div className="w-full">
      <LazyWrapper
        componentName="Navigation"
        importFunction={() => import("../NavHeroContainer")}
        rootMargin="0px"
      />

      <LazyWrapper
        componentName="TextWithParticles"
        importFunction={() => import("../HomeComponents/Intro2")}
        rootMargin="0px"
      />

      <LazyWrapper
        componentName="GlowingEffectDemo"
        className="max-w-4xl mx-auto mt-52"
        importFunction={() => import("./glowing-effectDemo")}
        minScrollY={200}
      />

      <LazyWrapper
        componentName="Gradient"
        className=""
        importFunction={() => import("./GradientModelWrapper")}
        minScrollY={220}
      />

      <LazyWrapper
        componentName="Scene"
        className=""
        importFunction={() => import("./3dmodels/Scene")}
        // rootMargin="100px 0px" 
        minScrollY={50}
      />

       <LazyWrapper
        componentName="Testimonial"
        className=""
        importFunction={() => import("./Testimonial")}
        // rootMargin="100px 0px" 
        minScrollY={50}
      />
    </div>
  );
}
