"use cache";
import { getUser } from "@/lib/user";
import ContributionsData from "../components/aboutComponents/ContributionData";
import { ContributionGraph } from "../components/aboutComponents/ContributionGraph";
import RainingLetters from "../components/aboutComponents/RainingLetters";
import TechnicalStack from "../components/aboutComponents/TechnicalStack";
import { Timeline } from "../components/aboutComponents/Timeline";
import { TimelineDemo } from "../components/aboutComponents/TimelineDemo";
import LoginButton from "../components/LoginLogoutButton";
import ShuffleText from "../components/ShuffleText";
import UserGreetText from "../components/UserGreetText";
import GlowingCardWrapper from "../components/aboutComponents/GlowingCardWrapper";

export default async function About() {
  return (
    <section>
      <div className="relative z-10 bg-background ">
        <RainingLetters />
      </div>
      <div className="mx-auto max-w-6xl h-screen md:h-[200vh] relative">
        <ShuffleText />
      </div>
      
      <div className="relative z-10 bg-background mt-0 md:mt-24 lg:mt-42">
        <TechnicalStack />
        
      </div>
      {/* <ContributionsData/> */}
      {/* <UserGreetText/> */}

      {/* <GlowingCardWrapper/> */}

      <TimelineDemo />
    </section>
  );
}
