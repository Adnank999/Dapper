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
  return <Html center className="hidden">{progress.toFixed(1)} % loaded</Html>;
};

const Scene = () => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollRevealRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lenis = useLenis();
  const [isVisible, setIsVisible] = useState(false);
  
  console.log("isVisible", isVisible);
  const [showScrollReveal, setShowScrollReveal] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  const scrollProgress = useRef(0);
  const isMobile = useIsMobile();
  let timeoutId: NodeJS.Timeout;
  // console.log("is mobile", isMobile);

  useEffect(() => {
    if (!lenis || !canvasRef.current || !scrollContainerRef.current) return;

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

    // 💡 Master Timeline with all behavior
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top top+=100",
        end: "bottom bottom",
        scrub: true,
        // markers: true,
        onEnter: () => {
          setIsVisible(true);
        },
        // onLeave: () => {
        //   setIsVisible(false);
        // },
        onEnterBack: () => setIsVisible(true), // ✅ Back into range from below
        // onLeaveBack: () => setIsVisible(false),
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      },

      onComplete: () => {
        setTimeout(() => {
          setShowScrollReveal(true);
        }, 50); // 1000ms = 1 second delay
      },
    });

    tl.fromTo(
      canvasRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" } // Fade in
    )
      .to(canvasRef.current, { opacity: 1, duration: 0.4 }) // Hold
      .to({}, { duration: 0.3 }); 


    tl.to(canvasRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.inOut",
      delay: 10,
    });

    // ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.off("scroll", ScrollTrigger.update);
    };
  }, [lenis]);

  // console.log("animationCompleted", animationCompleted);

  return (
    <div
      ref={scrollContainerRef}
      style={{
        position: "relative",
        height: "400vh",
        width: "100vw",
        overflow: "hidden",
        // opacity: 0,
      }}
      // className="bg-red-200"
    >
      
      <Canvas
        ref={canvasRef}
        frameloop="demand"
        gl={{ 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          antialias: true
        }}

        camera={{
          position: [
            -6.782809400330284, 2.3973643603409034, 1.4024392340644003,
          ],
          // fov: 35,
          fov: isMobile ? 45 : 35,
        }}
        
        dpr={[1, 1.5]}
        style={{
          position: "fixed",
          top: 0,
          left: 0,

          width: "100vw",
       
          zIndex: 0,
          pointerEvents: "none", // see below!
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
            <Model
              visible={isVisible}
              scrollProgress={scrollProgress}
              animationCompleted={animationCompleted}
              setAnimationCompleted={setAnimationCompleted}
            />
          </ScrollControls>
        </Suspense>

        <EffectComposer>
          <Bloom intensity={5} luminanceThreshold={0} luminanceSmoothing={0} />
        </EffectComposer>
      </Canvas>

      {isVisible && (
        <div
          ref={scrollRevealRef}
          className="flex items-center justify-center px-24 lg:px-0 w-96 h-screen absolute top-40 left-0 lg:left-auto lg:right-24 "
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

      {showScrollReveal && (
        <div
          ref={scrollRevealRef}
          className="flex items-start justify-center w-full lg:w-96  px-5 text-center lg:px-0 h-48 absolute bottom-[5%] lg:bottom-[10%] left-0 lg:left-auto lg:right-24"
        >
          <ScrollReveal
            scrollContainerRef={scrollContainerRef as RefObject<HTMLElement>}
            baseOpacity={0}
            enableBlur={true}
            baseRotation={0}
            blurStrength={10}
            textClassName="font-mustang"
          
          >
            With Great Power Comes Great Responsibility
          </ScrollReveal>
        </div>
      )}
    </div>
  );
};

export default Scene;



