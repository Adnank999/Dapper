

// 'use client';
// import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
// import { ShapeOverlays } from '@/utils/ShapeOverlays';

// type MenuContextType = {
//   isMenuOpen: boolean;
//   toggleMenu: () => void;
//   closeMenu: () => void;
// };

// const MenuContext = createContext<MenuContextType | undefined>(undefined);

// export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const overlayRef = useRef<ShapeOverlays | null>(null);
//   const svgRef = useRef<SVGSVGElement | null>(null);
//   const hamburgerRef = useRef<HTMLDivElement | null>(null);
//   const navItemsRef = useRef<NodeListOf<HTMLElement> | null>(null);

//   useEffect(() => {
//     const overlayElement = document.querySelector(".shape-overlays") as SVGSVGElement;
//     const hamburgerElement = document.querySelector(".hamburger") as HTMLDivElement;
//     const navItems = document.querySelectorAll(".global-menu__item") as NodeListOf<HTMLElement>;

//     if (overlayElement) {
//       svgRef.current = overlayElement;
//       overlayRef.current = new ShapeOverlays(overlayElement);
//     }
//     if (hamburgerElement) hamburgerRef.current = hamburgerElement;
//     if (navItems) navItemsRef.current = navItems;
//   }, []);

//   const toggleMenu = () => {
//     if (!overlayRef.current || overlayRef.current.isAnimating) return;

//     overlayRef.current.toggle();
//     setIsMenuOpen((prev) => !prev);

//     if (overlayRef.current.isOpened) {
//       hamburgerRef.current?.classList.add("is-opened-navi");
//       navItemsRef.current?.forEach((item) => item.classList.add("is-opened"));
//     } else {
//       hamburgerRef.current?.classList.remove("is-opened-navi");
//       navItemsRef.current?.forEach((item) => item.classList.remove("is-opened"));
//     }
//   };

//   const closeMenu = () => {
//     if (!overlayRef.current || overlayRef.current.isAnimating || !overlayRef.current.isOpened) return;

//     overlayRef.current.toggle();
//     setIsMenuOpen(false);

//     hamburgerRef.current?.classList.remove("is-opened-navi");
//     navItemsRef.current?.forEach((item) => item.classList.remove("is-opened"));
//   };

//   return (
//     <MenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
//       {children}
//       {/* Shape Overlay (SVG) */}
//       <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
//         <path className="shape-overlays__path"></path>
//         <path className="shape-overlays__path"></path>
//       </svg>

      
//     </MenuContext.Provider>
//   );
// };

// export const useMenuContext = (): MenuContextType => {
//   const context = useContext(MenuContext);
//   if (!context) {
//     throw new Error('useMenuContext must be used within a MenuProvider');
//   }
//   return context;
// };


'use client';
import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from 'react';
import { ShapeOverlays } from '@/utils/ShapeOverlays';

type MenuContextType = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Memoization storage for ShapeOverlays
const overlayInstanceMap = new WeakMap<SVGSVGElement, ShapeOverlays>();

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const overlayRef = useRef<ShapeOverlays | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    const overlayElement = document.querySelector(
      '.shape-overlays'
    ) as SVGSVGElement;
    const hamburgerElement = document.querySelector(
      '.hamburger'
    ) as HTMLDivElement;
    const navItems = document.querySelectorAll(
      '.global-menu__item'
    ) as NodeListOf<HTMLElement>;

    console.log("DOM Loaded:");
    console.log("Overlay Element:", overlayElement);
    console.log("Hamburger Element:", hamburgerElement);
    console.log("Nav Items:", navItems);

    if (overlayElement) {
      svgRef.current = overlayElement;

      if (!overlayInstanceMap.has(overlayElement)) {
        console.log("Creating new ShapeOverlays instance...");
        overlayInstanceMap.set(overlayElement, new ShapeOverlays(overlayElement));
      } else {
        console.log("Reusing ShapeOverlays from WeakMap...");
      }

      overlayRef.current = overlayInstanceMap.get(overlayElement)!;
      console.log("Overlay Instance:", overlayRef.current);
    }

    if (hamburgerElement) hamburgerRef.current = hamburgerElement;
    if (navItems) navItemsRef.current = navItems;
  }, []);

  const toggleMenu = () => {
  const overlay = overlayRef.current;
  if (!overlay) {
    console.warn("No overlay instance available!");
    return;
  }

  console.log("Toggle Triggered");
  console.log("Overlay isAnimating:", overlay.isAnimating);

  if (overlay.isAnimating) return;

  overlay.toggle();

  // Flip based on React state (not overlay.isOpened)
  const isNowOpen = !isMenuOpen;
  setIsMenuOpen(isNowOpen);
  console.log("React isMenuOpen (next):", isNowOpen);

  if (isNowOpen) {
    console.log("Opening menu: adding classes...");
    hamburgerRef.current?.classList.add('is-opened-navi');
    navItemsRef.current?.forEach((item) => item.classList.add('is-opened'));
  } else {
    console.log("Closing menu: removing classes...");
    hamburgerRef.current?.classList.remove('is-opened-navi');
    navItemsRef.current?.forEach((item) => item.classList.remove('is-opened'));
  }
};


  const closeMenu = () => {
    const overlay = overlayRef.current;
    if (!overlay || overlay.isAnimating || !overlay.isOpened) {
      console.warn("Can't close: overlay invalid or already closed.");
      return;
    }

    console.log("Closing menu via closeMenu()");
    overlay.toggle();
    setIsMenuOpen(false);

    hamburgerRef.current?.classList.remove('is-opened-navi');
    navItemsRef.current?.forEach((item) => item.classList.remove('is-opened'));
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
      {children}
      <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path className="shape-overlays__path"></path>
        <path className="shape-overlays__path"></path>
      </svg>
    </MenuContext.Provider>
  );
};

export const useMenuContext = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};




















































