import Image from "next/image";
import SplashCursor from "./components/SplashCursor";
import TextWithParticles from "./components/TextWithParticles";
import Navbar from "./components/Navbar/Navbar";
import { Button } from "@heroui/react";
import NavbarHeroUi from "./components/Navbar/NavbarHeroUi";
import NavbarSvg from "./components/Navbar/NavbarSvg";
import NavHeroContainer from "./components/NavHeroContainer";
import Transition from "./components/Transition";
import GradientSection from "./components/GradientSection";
import ShuffleText from "./components/ShuffleText";
import CurvedNavbar from "./components/CurvedNavbar";

export default function Home() {
  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden w-full relative">
       
        <NavHeroContainer />

        <div className=" flex flex-col ">
          <TextWithParticles />
        </div>

        <GradientSection />
        
        <div className="h-screen bg-black"></div>
         
      </div>
    </>
  );
}
