"use client";
import React, { memo } from "react";

import SplashCursor from "./SplashCursor";

import { useMenuContext } from "../context/MenuContext";

const NavHeroContainer = () => {
  const { isMenuOpen } = useMenuContext();
  console.log("nav hero rendered")
  return (
    <>
      <SplashCursor isMenuOpen={isMenuOpen} />
    </>
  );
};

export default  React.memo(NavHeroContainer);
