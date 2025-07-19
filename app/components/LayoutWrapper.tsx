// 'use client';

// import React, { useState, useEffect } from 'react';
// import Preloader from './Preloader';

// const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
//   const [showPreloader, setShowPreloader] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowPreloader(false);
//     }, 4000); // 5 seconds

//     return () => clearTimeout(timer);
//   }, []);

//   if (showPreloader) {
//     return <Preloader />;
//   }

//   return <>{children}</>;
// };

// export default LayoutWrapper;

"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Preloader from "./Preloader";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showPreloader, setShowPreloader] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Preloader only on initial '/' page load
  useEffect(() => {
    if (pathname === "/") {
      setShowPreloader(true);
      const timer = setTimeout(() => {
        setShowPreloader(false);
      }, 3000); // Preloader duration
      return () => clearTimeout(timer);
    } else {
      setShowContent(true); // Instantly show content on other routes
    }
  }, [pathname]);

  // Show preloader
  if (showPreloader) {
    return <Preloader />;
  }

  return <div className="relative w-full h-full">{children}</div>;
};

export default LayoutWrapper;
