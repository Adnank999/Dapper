"use client";
import React, { RefObject } from "react";
import Terminal from "react-animated-term";

type TerminalFrame = {
  text: string;
  delay: number;
};

type TerminalLine = {
  text: string;
  cmd: boolean;
  repeat?: boolean;
  repeatCount?: number;
  frames?: TerminalFrame[];
  finalFrame?: string;
};




const termLines: TerminalLine[] = [
  { text: "yarn", cmd: true },
  { text: "yarn install v1.6.0", cmd: false },
  { text: "[1/4] 🔍  Resolving packages...", cmd: false },
  { text: "[2/4] 🚚  Fetching 10000 npm packages...", cmd: false },
  {
    text: "[3/4] 🔗  Linking dependencies...",
    cmd: false,
    frames: [
      { text: "[------------------------------------------------] 0/1000", delay: 200 },
      { text: "[#######-----------------------------------------] 100/1000", delay: 2000 },
      { text: "[###########################---------------------] 500/1000", delay: 200 },
      { text: "[################################################] 1000/1000", delay: 400 }
    ]
  },
  {
    text: "[4/4] 📃  Building fresh packages...",
    cmd: false,
    frames: [
      { text: "[------------------------------------------------] 0/1000", delay: 200 },
      { text: "[#######-----------------------------------------] 100/1000", delay: 300 },
      { text: "[###########################---------------------] 500/1000", delay: 1200 },
      { text: "[################################################] 1000/1000", delay: 400 }
    ]
  },
  { text: "✨  Done in 4.91s.", cmd: false },
  { text: "", cmd: true }


];

interface TerminalComponentProps {
  textRef: RefObject<HTMLDivElement>;
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({ textRef }) => (
  <div className=" mt-10 w-[80%]">
    <Terminal lines={termLines}/>
  </div>
);

export default TerminalComponent;
