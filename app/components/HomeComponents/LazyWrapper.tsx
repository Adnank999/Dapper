'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface LazyWrapperProps {
  delay?: number;
  className?: string;
  componentName?: string;
  importFunction: () => Promise<{ default: React.ComponentType<any> }>;
  rootMargin?: string;
  initialDelay?: number;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  delay = 0,
  className = '',
  componentName = 'Component',
  importFunction,
  rootMargin = '10px',
  initialDelay = 0,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [canTrigger, setCanTrigger] = useState(initialDelay === 0);
  const [LazyComponent, setLazyComponent] = useState<React.ComponentType | null>(null);

  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
    threshold: 0.1,
  });

  // Handle initial delay
  useEffect(() => {
    if (initialDelay > 0) {
      const timer = setTimeout(() => {
        setCanTrigger(true);
      }, initialDelay);
      return () => clearTimeout(timer);
    }
  }, [initialDelay]);

  // Trigger loading when in view and can trigger
  useEffect(() => {
    if (inView && canTrigger && !shouldLoad) {
      if (delay > 0) {
        setTimeout(() => {
          setShouldLoad(true);
          // Create lazy component
          const Component = lazy(importFunction);
          setLazyComponent(Component);
        }, delay);
      } else {
        setShouldLoad(true);
        const Component = lazy(importFunction);
        setLazyComponent(Component);
      }
    }
  }, [inView, canTrigger, shouldLoad, delay, importFunction]);

  const getSkeletonLoader = () => {
    switch (componentName) {
      case 'Navigation':
        return <div className="h-16 bg-gray-200 animate-pulse rounded-lg" />;
      case 'TextWithParticles':
        return (
          <div className="space-y-6 py-8 animate-pulse">
            <div className="h-16 bg-gray-200 rounded-lg w-4/5 mx-auto" />
            <div className="h-12 bg-gray-200 rounded-lg w-3/5 mx-auto" />
          </div>
        );
      case 'GlowingEffect':
        return <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded-lg" />;
      default:
        return <div className="h-32 bg-gray-200 animate-pulse rounded-lg" />;
    }
  };

  return (
    <div ref={ref} className={className}>
      {shouldLoad && LazyComponent ? (
        <Suspense fallback={getSkeletonLoader()}>
          <div className="animate-fade-in-up">
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
