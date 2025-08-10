"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showPreloader, setShowPreloader] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setShowPreloader(true);
      setFadeOut(false);

      // Start fade transition
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      // Remove preloader after fade completes
      const removeTimer = setTimeout(() => {
        setShowPreloader(false);
      }, 2500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [pathname]);

    if (showPreloader) {
    return (
      <>
        {/* Preloader layer */}
        <div className={`fixed inset-0 z-50 transition-opacity duration-500 ${
            fadeOut ? 'opacity-0' : 'opacity-100'
          }`}>
          <Preloader />
        </div>
       
      </>
    );
  }

  return (
    <>
      
      {/* Content */}
      <div 
        className={`relative w-full h-full transition-opacity duration-500 ${
          showPreloader && !fadeOut ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default LayoutWrapper;
