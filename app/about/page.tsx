
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
import UserInfo from "../components/UserInfo";

export default async  function About() {

  return (
    <section className="mt-52 text-black bg-white">
      {/* <div className="relative z-10 bg-background">
        <RainingLetters />
        </div>
      <div className="mx-auto max-w-6xl h-[100vh] mb-24 relative">
        <ShuffleText />
      </div>

      <div className="relative z-10 bg-background">
        <TechnicalStack/>
        <ContributionsData/>
      </div> */}

      <UserGreetText/>
      {/* <UserInfo/> */}
      <LoginButton/>
      
     
      {/* <TimelineDemo/> */}
    </section>
  );
}
