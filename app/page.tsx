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

const logos: SlidingLogoMarqueeItem[] = [
  {
    id: "1",
    content: <Github />,
    href: "https://github.com/Adnank999",
  },
  {
    id: "2",
    content: <Linkedin />,
    href: "https://www.linkedin.com/in/adnan-khan-9292971a6/",
  },
  {
    id: "3",
    content: <Github />,
    href: "https://github.com/Adnank999",
  },
  {
    id: "4",
    content: <Linkedin />,
    href: "https://www.linkedin.com/in/adnan-khan-9292971a6/",
  },
  {
    id: "5",
    content: <Github />,
    href: "https://github.com/Adnank999",
  },
  {
    id: "6",
    content: <Linkedin />,
    href: "https://www.linkedin.com/in/adnan-khan-9292971a6/",
  },
];

export default async function Home() {
  return (
    <>
      <div className="overflow-x-hidden overflow-y-hidden">
        <div className="min-h-screen flex items-center justify-center">
          <LazyHeroSection />
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <SlidingLogo
            items={logos}
            speed={60}
            height="120px"
            enableBlur={true}
            blurIntensity={2}
            pauseOnHover={true}
            showGridBackground={true}
            // onItemClick={(item) => console.log("Clicked:", item.id)}
          />
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
