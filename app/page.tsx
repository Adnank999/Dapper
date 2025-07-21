import Image from "next/image";
import SplashCursor from "./components/SplashCursor";
import TextWithParticles from "./components/TextWithParticles";

import NavHeroContainer from "./components/NavHeroContainer";
import Transition from "./components/Transition";
import GradientSection from "./components/GradientSection";
import ShuffleText from "./components/ShuffleText";
import CurvedNavbar from "./components/CurvedNavbar";

import { GlowingEffectDemo } from "./components/HomeComponents/glowing-effectDemo";
import Scene from "./components/HomeComponents/3dmodels/Scene";
import ScrollReveal from "./components/HomeComponents/ScrollReveal";
import TransitionButton from "./components/HomeComponents/TransitionButton";
import RainingLetters from "./components/aboutComponents/RainingLetters";
import SvgIcon from "./components/aboutComponents/SvgIcon";
import Preloader from "./components/Preloader";
import LayoutWrapper from "./components/LayoutWrapper";

export default function Home() {
  return (
    <>
      
      <div className="overflow-x-hidden overflow-y-hidden">
        
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto flex flex-col items-center justify-center">
            <div className="w-full">
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

        {/* <div className="p-4 h-screen">
         
          <TransitionButton>
            Sound Ethics champions the rights and interests of artists at every
            turn. Our core mission is to ensure that the creative copyright of
            artists is respected and protected as artificial intelligence
            becomes more integrated into the music industry.
          </TransitionButton>
        </div> */}

        {/* <div className="min-h-screen">
          <RainingLetters/>
        </div> */}
      </div>
    </>
  );
}
