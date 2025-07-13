"use client";
import { Canvas } from "@react-three/fiber";
import React, { RefObject, Suspense, useEffect, useRef, useState } from "react";
import { Html, ScrollControls, useProgress } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Model from "./Model";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollReveal from "../ScrollReveal";
import { extend } from "@react-three/fiber";
import useIsMobile from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(1)} % loaded</Html>;
};

const Scene = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRevealRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollReveal, setShowScrollReveal] = useState(false);
  const [animationCompleted,setAnimationCompleted] = useState(false)
  const scrollProgress = useRef(0);
  const isMobile = useIsMobile();
  console.log('is mobile',isMobile)
  useEffect(() => {
    if (!lenis) return;
    // if (!scrollRevealRef.current) return;
    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return value !== undefined ? lenis.scrollTo(value) : lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({ scroller: document.body });

    // Fade-in animation for the scrollContainerRef
    // gsap.fromTo(
    //   canvasRef.current,
    //   { opacity: 0 }, // Start with opacity 0
    //   {
    //     opacity: 1, // Fade to opacity 1
    //     duration: 1.5, // Duration of the fade-in
    //     ease: "power2.out", // Smooth easing
    //     scrollTrigger: {
    //       trigger: scrollContainerRef.current,
    //       start: "top 40%", // Trigger when the top of the container is 80% down the viewport
    //       end: "top 10%", // End animation when the top of the container is 50% down the viewport
    //       scrub: true, // Smoothly sync with the scroll
    //       markers: true, // Debug markers (optional)
    //       onEnter: () => {
    //         setIsVisible(true);
    //       },
    //       onLeave: () => {
    //         setIsVisible(false);
    //       },
    //     },
    //     onComplete: () => {
    //       setShowScrollReveal(true);
    //     },
    //   }
    // );

    gsap.fromTo(
      canvasRef.current,
      { opacity: 0 }, // Start with opacity 0
      {
        opacity: 1, // Fade to opacity 1
        duration: 1.5, // Duration of the fade-in
        ease: "power2.out", // Smooth easing
        scrollTrigger: {
          trigger: scrollContainerRef.current,
              start: "top 30%", // Adjust this value to ensure proper timing
          end: "top 5%",
          scrub: true, // Smoothly sync with the scroll
          markers: true, // Debug markers (optional)
          onEnter: () => {
            setIsVisible(true);
          },
          onLeave: () => {
            setIsVisible(false);
          },
        },
        onComplete: () => {
          // Show ScrollReveal after Canvas animation completes
          setShowScrollReveal(true);
        },
      }
    );

    ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      markers: true,
      onEnter: () => {
        setIsVisible(true);
      },
      onLeave: () => {
        setIsVisible(false);
      },
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
      },
      
    });

      

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

console.log("animationCompleted",animationCompleted)
  return (
    <div
      ref={scrollContainerRef}
      style={{
        position: "relative",
        height: "300vh",
        width: "100vw",
        // opacity: 0,
      }}
    >
      <Canvas
        ref={canvasRef}
        camera={{
          position: [
            -6.782809400330284, 0.3973643603409034, 1.4024392340644003,
          ],
          // fov: 35,
          fov: isMobile ? 45 : 35,
        }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          height: "100%",
        }}
      >
        <directionalLight position={[-5, -5, 5]} intensity={4} />
        {/* <OrbitControls
            enablePan={true}
            enableRotate={true}
            // enableZoom={true}
          /> */}
        <Suspense fallback={<Loader />}>
          <ScrollControls
            // pages={5}
            damping={0.5}
            infinite={false}
            enabled={false}
            style={{ overflow: "hidden" }}
          >
            <Model visible={isVisible} scrollProgress={scrollProgress} setAnimationCompleted={setAnimationCompleted}/>
          </ScrollControls>
        </Suspense>

        <EffectComposer>
          <Bloom intensity={5} luminanceThreshold={0} luminanceSmoothing={0} />
        </EffectComposer>
      </Canvas>

      {showScrollReveal && (
        <div
          ref={scrollRevealRef}
          className="px-24 lg:px-0 w-96 h-screen absolute top-12 left-0 lg:left-auto lg:right-24"
        >
          <ScrollReveal
            scrollContainerRef={scrollContainerRef as RefObject<HTMLElement>}
            baseOpacity={0}
            enableBlur={true}
            baseRotation={0}
            blurStrength={10}
            textClassName="text-white"
          >
            With Great Power Comes Great Responsibility.
          </ScrollReveal>
        </div>
      )}

      {animationCompleted && (
        <div
          ref={scrollRevealRef}
          className="w-96 px-12 lg:px-0 h-screen absolute -bottom-10 left-0 lg:left-auto lg:right-24"
        >
          <ScrollReveal
            scrollContainerRef={scrollContainerRef as RefObject<HTMLElement>}
            baseOpacity={0}
            enableBlur={true}
            baseRotation={0}
            blurStrength={10}
           
          >
            With Great Power Comes Great Responsibility
          </ScrollReveal>
        </div>
      )}
    </div>
  );
};

export default Scene;

