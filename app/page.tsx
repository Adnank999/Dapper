"use cache";

import TextWithParticles from "./components/TextWithParticles";

import NavHeroContainer from "./components/NavHeroContainer";

import { GlowingEffectDemo } from "./components/HomeComponents/glowing-effectDemo";

import TransitionButton from "./components/HomeComponents/TransitionButton";

import SvgIcon from "./components/aboutComponents/SvgIcon";
import Preloader from "./components/Preloader";
import dynamic from "next/dynamic";
import GradientSection from "./components/GradientSection";
import GlowingKeyboard from "./components/HomeComponents/GlowingKeyboard";
import SlidingLogo, { SlidingLogoMarqueeItem } from "./components/SlidingLogo";
import { Github, Linkedin } from "lucide-react";

const LazyHeroSection = dynamic(
  () => import("./components/HomeComponents/Hero"),
  {
    loading: () => <>Preparing</>,
  }
);



export default async function Home() {
  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden">
        <div className="min-h-screen flex items-center justify-center">
          <LazyHeroSection />
        </div>

      

        {/* <div className="p-4 h-screen">
         
          <TransitionButton>
            Sound Ethics champions the rights and interests of artists at every
            turn. Our core mission is to ensure that the creative copyright of
            artists is respected and protected as artificial intelligence
            becomes more integrated into the music industry.
          </TransitionButton>
        </div> */}
      </div>
    </>
  );
}
