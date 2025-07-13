import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() => {
    // Initial check based on the window width
    return typeof window !== "undefined" && window.innerWidth <= breakpoint;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

    // Handler to update `isMobile` when the screen size changes
    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Add event listener for media query changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleResize);
    } else {
      // For older browsers
      mediaQuery.addListener(handleResize);
    }

    // Set the initial state
    setIsMobile(mediaQuery.matches);

    // Cleanup listener on component unmount
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleResize);
      } else {
        mediaQuery.removeListener(handleResize);
      }
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
