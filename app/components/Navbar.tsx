"use client";
import { useMenuContext } from "@/app/context/MenuContext";
import "../normalize.css";
import DistortedEffect from "./DistortedEffect/DistortedEffect";

const Navbar = () => {
  const { toggleMenu, isMenuOpen, closeMenu } = useMenuContext(); // Get the toggle function

  return (
    <div className="main main--demo-5">
      {/* Hamburger Button */}
      <div
        className="hamburger hamburger--demo-5 js-hover"
        onClick={toggleMenu}
      >
        <div>
          <div className="hamburger__line hamburger__line--01">
            <div className="hamburger__line-in hamburger__line-in--01 hamburger__line-in--demo-5"></div>
          </div>
          <div className="hamburger__line hamburger__line--02">
            <div className="hamburger__line-in hamburger__line-in--02 hamburger__line-in--demo-5"></div>
          </div>
          <div className="hamburger__line hamburger__line--03">
            <div className="hamburger__line-in hamburger__line-in--03 hamburger__line-in--demo-5"></div>
          </div>
        </div>
        <div>
          <div className="hamburger__line hamburger__line--cross01">
            <div className="hamburger__line-in hamburger__line-in--cross01 hamburger__line-in--demo-5"></div>
          </div>
          <div className="hamburger__line hamburger__line--cross02">
            <div className="hamburger__line-in hamburger__line-in--cross02 hamburger__line-in--demo-5"></div>
          </div>
        </div>
      </div>
      <div className={`content ${isMenuOpen ? "visible" : "hidden"}`}>
        {/* Global Menu */}
        <div className="global-menu relative">
          <div className="global-menu__wrap">
            <DistortedEffect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
