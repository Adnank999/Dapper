'use cache'
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


export default async  function About() {

  return (
    <section >
      <div className="relative z-10 bg-background">
        <RainingLetters />
        </div>
      <div className="mx-auto max-w-6xl h-[200vh] mb-24 relative">
        <ShuffleText />
      </div>

      <div className="relative z-10 bg-background">
        <TechnicalStack/>
        {/* <ContributionsData/> */}
      </div>

      {/* <UserGreetText/> */}
   
   
      {/* <GlowingCardWrapper/> */}
     
      <TimelineDemo/>
    </section>
  );
}
