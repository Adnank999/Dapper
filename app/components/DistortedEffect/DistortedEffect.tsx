"use client";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { gsap } from "gsap";
import AnimatedLinksObjs from "./animatedLink";
import Link from "next/link";
import localFont from "next/font/local";
import { useMenuContext } from "@/app/context/MenuContext";
import { useRouter } from "next/navigation";

const fk = localFont({
  src: "../../../public/fonts/FKScreamerTrial-Bold-BF6571330a76e9b.otf",
});



function DistortedEffect() {
  const menuLinksRef = useRef([]); // Ref to hold menu link elements
  const {isMenuOpen,closeMenu } = useMenuContext();
  // console.log("isMenuOpen",isMenuOpen)
  useEffect(() => {
    // Initialize animations for each menu link
    menuLinksRef.current.forEach((el, index) => {
      const fxObj = AnimatedLinksObjs[index];
      if (fxObj) {
        new fxObj(el);
      }
    });
  }, []); // Empty dependency array ensures this runs once on mount

  return (

    <div className="demo-5 ">
      <svg className="hideSvg">
        <defs>
          <filter id="filter-1">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="1"
              result="warp"
            />
            <feOffset dx="-90" result="warpOffset" />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="30"
              in="SourceGraphic"
              in2="warpOffset"
            />
          </filter>
          <filter id="filter-2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="10"
              result="warp"
            />
            <feOffset dx="-90" result="warpOffset" />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="60"
              in="SourceGraphic"
              in2="warpOffset"
            />
          </filter>
          <filter id="filter-3">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.15 0.02"
              numOctaves="3"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="0"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
          <filter id="filter-4">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="5"
              result="warp"
            />
            <feOffset dx="-90" result="warpOffset" />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="35"
              in="SourceGraphic"
              in2="warpOffset"
            />
          </filter>
          <filter id="filter-5">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.7"
              numOctaves="5"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="0"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
          <filter id="filter-6">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.07"
              numOctaves="5"
              seed="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="warp"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
          <filter id="filter-7">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="5"
              result="warp"
            />
            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="90"
              in="SourceGraphic"
              in2="warp"
            />
          </filter>
        </defs>
      </svg>

      <nav className="menu--twolines w-fit">
        {[
          { text: "Home", href: "/" },
          { text: "Portfolio", href: "/portfolio" },
          { text: "About", href: "/about" },
          { text: "Contact", href: "/contact" },
        ].map(({ text, href }, index) => (
          <Link
            key={index}
            className={`menu__link ${fk.className} tracking-wider global-menu__item global-menu__item--demo-5 `}
            href={href} // Assign dynamic href here
            ref={(el) => (menuLinksRef.current[index] = el)} // Add the element to the ref array
            onClick={closeMenu}
          >
            {text}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default DistortedEffect;







