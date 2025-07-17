import Image from "next/image";
import SplashCursor from "./components/SplashCursor";
import TextWithParticles from "./components/TextWithParticles";

import { Button } from "@heroui/react";

import NavHeroContainer from "./components/NavHeroContainer";
import Transition from "./components/Transition";
import GradientSection from "./components/GradientSection";
import ShuffleText from "./components/ShuffleText";
import CurvedNavbar from "./components/CurvedNavbar";

import { GlowingEffectDemo } from "./components/HomeComponents/glowing-effectDemo";
import Scene from "./components/HomeComponents/3dmodels/Scene";
import ScrollReveal from "./components/HomeComponents/ScrollReveal";
import TransitionButton from "./components/HomeComponents/TransitionButton";

export default function Home() {
  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
            <div className=" w-full">
              <NavHeroContainer />

              <TextWithParticles />

              <div className="max-w-4xl mx-auto">
                <GlowingEffectDemo />
              </div>
            </div>
          </div>
        </div>

        <GradientSection />

        <Scene />

        <div className="h-screen flex flex-col justify-center items-center z-10 bg-red-200 pointer-events-auto">
          <TransitionButton />
        </div>

   
      </div>
    </>
  );
}
