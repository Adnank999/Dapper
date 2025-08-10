"use client";

import React, { Suspense, lazy, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyWrapperProps {
  className?: string;
  componentName?: string;
  importFunction: () => Promise<{ default: React.ComponentType<any> }>;
  rootMargin?: string;
  initialDelay?: number;
  minScrollY?: number;
  fallbackHeight?: string; // Add this for consistent height
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  className = "",
  componentName = "Component",
  importFunction,
  rootMargin = "0px",
  initialDelay = 0,
  minScrollY = 0,
  fallbackHeight = "auto",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [LazyComponent, setLazyComponent] = useState<React.ComponentType | null>(null);
  const [scrollY, setScrollY] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
    threshold: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (inView && scrollY >= minScrollY && !LazyComponent && !isLoading) {
      console.log(`${componentName} is in view, loading...`);
      setIsLoading(true);
      
      // Add initial delay if specified
      const loadComponent = async () => {
        if (initialDelay > 0) {
          await new Promise(resolve => setTimeout(resolve, initialDelay));
        }
        
        const Component = lazy(importFunction);
        setLazyComponent(() => Component);
        setIsLoading(false);
      };

      loadComponent();
    }
  }, [inView, scrollY, minScrollY, LazyComponent, isLoading, initialDelay, importFunction, componentName]);

  const getSkeletonLoader = () => {
    const baseClasses = "animate-pulse";
    
    switch (componentName) {
      case "Navigation":
        return (
          <div className={`w-full ${baseClasses}`} style={{ minHeight: fallbackHeight }}>
            <div className="flex items-center justify-between p-4">
              <Skeleton className="h-8 w-32" />
              <div className="flex space-x-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        );
      case "TextWithParticles":
        return (
          <div className={` min-h-96 flex flex-col items-center justify-center space-y-4 p-8 ${baseClasses}`}>
            <Skeleton className="h-12 w-3/4 max-w-2xl" />
            <Skeleton className="h-8 w-1/2 max-w-lg" />
            <div className="grid grid-cols-8 gap-2 mt-8">
              {Array.from({ length: 24 }).map((_, i) => (
                <Skeleton key={i} className="h-2 w-2 rounded-full" />
              ))}
            </div>
          </div>
        );
      case "GlowingEffectDemo":
        return (
          <div className={` min-h-80 flex items-center justify-center p-8 ${baseClasses}`}>
            <div className="relative">
              <Skeleton className="h-48 w-48 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        );
      case "Gradient":
        return (
          <div className={`min-h-64 p-8 ${baseClasses}`}>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        );
      case "Scene":
        return (
          <div className={` min-h-96 p-4 ${baseClasses}`}>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        );
      default:
        return (
          <div className={`min-h-64 p-4 ${baseClasses}`} style={{ minHeight: fallbackHeight }}>
            <Skeleton className="h-full w-full rounded-lg" />
          </div>
        );
    }
  };

  // Don't render anything until component is in view
  if (!inView) {
    return <div ref={ref} className={className} style={{ minHeight: fallbackHeight }} />;
  }

  return (
    <div ref={ref} className={className}>
      {LazyComponent ? (
        <Suspense fallback={getSkeletonLoader()}>
          <LazyComponent />
        </Suspense>
      ) : (
        getSkeletonLoader()
      )}
    </div>
  );
};

export default LazyWrapper;
