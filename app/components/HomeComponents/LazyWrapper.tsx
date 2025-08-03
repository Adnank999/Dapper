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
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  className = "",
  componentName = "Component",
  importFunction,
  rootMargin = "0px",
  initialDelay = 0,
  minScrollY = 0,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [canTrigger, setCanTrigger] = useState(initialDelay === 0);
  const [LazyComponent, setLazyComponent] =
    useState<React.ComponentType | null>(null);
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
    if (inView && canTrigger && !shouldLoad && scrollY >= minScrollY) {
      console.log(`${componentName} is in view, scrollY = ${scrollY}`);

      const loadComponent = () => {
        if (!LazyComponent) {
          const Component = lazy(importFunction);
          setLazyComponent(() => Component); // memoize
        }
        setShouldLoad(true);
      };

      loadComponent();
    }
  }, [inView, canTrigger, shouldLoad, importFunction, componentName, scrollY]);

  const getSkeletonLoader = () => {
    switch (componentName) {
      case "Navigation":
        return <Skeleton className="h-[20px] w-[100px] " />;
      case "TextWithParticles":
        return <Skeleton className="h-[20px] w-[100px] !bg-red-500" />;
      case "GlowingEffect":
        return <Skeleton className="h-[20px] w-[100px] !bg-red-500" />;
      default:
        return <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />;
    }
  };

  return (
    <div ref={ref} className={className}>
      {shouldLoad && LazyComponent ? (
        <Suspense fallback={<>loading.....</>}>
          <div>
            <LazyComponent />
          </div>
        </Suspense>
      ) : (
        <div className="min-h-[200px]" />
      )}
    </div>
  );
};

export default LazyWrapper;
