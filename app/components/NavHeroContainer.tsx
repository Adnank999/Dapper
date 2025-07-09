"use client";
import React from "react";

import SplashCursor from "./SplashCursor";

import { useMenuContext } from "../context/MenuContext";

const NavHeroContainer = () => {
  const { isMenuOpen } = useMenuContext();
  return (
    <>
      <SplashCursor isMenuOpen={isMenuOpen} />
    </>
  );
};

export default NavHeroContainer;
