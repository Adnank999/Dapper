

'use client';
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { ShapeOverlays } from '@/utils/ShapeOverlays';

type MenuContextType = {
  isMenuOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef<ShapeOverlays | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const hamburgerRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<NodeListOf<HTMLElement> | null>(null);

  useEffect(() => {
    const overlayElement = document.querySelector(".shape-overlays") as SVGSVGElement;
    const hamburgerElement = document.querySelector(".hamburger") as HTMLDivElement;
    const navItems = document.querySelectorAll(".global-menu__item") as NodeListOf<HTMLElement>;

    if (overlayElement) {
      svgRef.current = overlayElement;
      overlayRef.current = new ShapeOverlays(overlayElement);
    }
    if (hamburgerElement) hamburgerRef.current = hamburgerElement;
    if (navItems) navItemsRef.current = navItems;
  }, []);

  const toggleMenu = () => {
    if (!overlayRef.current || overlayRef.current.isAnimating) return;

    overlayRef.current.toggle();
    setIsMenuOpen((prev) => !prev);

    if (overlayRef.current.isOpened) {
      hamburgerRef.current?.classList.add("is-opened-navi");
      navItemsRef.current?.forEach((item) => item.classList.add("is-opened"));
    } else {
      hamburgerRef.current?.classList.remove("is-opened-navi");
      navItemsRef.current?.forEach((item) => item.classList.remove("is-opened"));
    }
  };

  const closeMenu = () => {
    if (!overlayRef.current || overlayRef.current.isAnimating || !overlayRef.current.isOpened) return;

    overlayRef.current.toggle();
    setIsMenuOpen(false);

    hamburgerRef.current?.classList.remove("is-opened-navi");
    navItemsRef.current?.forEach((item) => item.classList.remove("is-opened"));
  };

  return (
    <MenuContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
      {children}
      {/* Shape Overlay (SVG) */}
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
