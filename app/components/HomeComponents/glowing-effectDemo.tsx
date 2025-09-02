"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import React from "react";
import IconCloud from "../IconCloud";

const GlowingEffectDemo = function GlowingEffect() {
  console.log("glowing effect rendered");
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-4">
      {/* Top-left */}
      <GridItem
        area=""
        icon={<Box className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Client-First Approach"
        description="Building trust through transparent communication and collaboration."
      />

      {/* Center - Modern Tech Stack, spans 2 rows */}
      <GridItem
        
        area="md:row-span-2"
        icon={<Lock className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Modern Tech Stack"
        description="Technologies and tools I use to build innovative solutions"
        techIcons={[
          { icon: "/icons/React.svg", name: "React" },
          { icon: "/icons/Javascript.svg", name: "Javascript" },
          { icon: "/icons/TypeScript.svg", name: "TypeScript" },
          { icon: "/icons/nextjs.svg", name: "Next.js" },
          // { icon: "/icons/FastAPI.svg", name: "FastAPI" },
          // { icon: "/icons/Nodejs.svg", name: "Node.js" },
          { icon: "/icons/Nuxt.svg", name: "Nuxt" },
          { icon: "/icons/Php.svg", name: "PHP" },
          { icon: "/icons/Spring.svg", name: "Spring" },
          { icon: "/icons/Svelte.svg", name: "Svelte" },
          { icon: "/icons/Python.svg", name: "Python" },
          { icon: "/icons/Laravel.svg", name: "Laravel" },
          { icon: "/icons/Vue.svg", name: "Vue.js" },
          
        ]}
      />

      {/* Top-right */}
      <GridItem
        area=""
        icon={<Sparkles className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="AI-Powered Solutions"
        description="Specializing in intelligent automation and LLM integrations."
      />

      {/* Bottom-left */}
      <GridItem
        area=""
        icon={<Settings className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Global Flexibility"
        description="Available across time zones for seamless worldwide collaboration."
      />

      {/* Bottom-right */}
      <GridItem
        area=""
        icon={<Search className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Ready to Collaborate"
        description="Let's create something amazing together"
      />
    </ul>
  );
};

export default React.memo(GlowingEffectDemo);

interface GridItemProps {
  area: string;
  icon: React.ReactNode;
  techIcons?: Array<{
    icon: string | StaticImport;
    name: string;
  }>;
  title: string;
  description: React.ReactNode;
}


const GridItem = ({
  area,
  icon,
  title,
  description,
  techIcons,
}: GridItemProps) => {
  return (
    <li className={`min-h-56 list-none ${area}`}>
      <div className="relative h-full rounded-2xl border p-2 md:rounded-3xl md:p-3 ">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />
        <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            <div className="space-y-3">
              <h3 className="-tracking-4 pt-0.5 text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className=" text-sm/[1.125rem] text-white md:text-sm/[1.375rem] dark:text-neutral-400 md:[&_b]:font-semibold md:[&_strong]:font-semibold">
                {description}
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-4 mt-6 ">
                {techIcons &&
                  techIcons.map((tech, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center px-3 py-2.5 rounded-lg border border-gray-600/70 bg-gray-900/40 backdrop-blur-xs hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 shadow-lg"
                    >
                      <div className="p-1.5 rounded-md bg-gray-800/80">
                        <Image
                          src={tech.icon}
                          alt={tech.name}
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                      </div>
                      <p className="mt-2.5 text-[10px] font-mono font-bold text-gray-300">
                        {tech.name}
                      </p>
                    </div>
                  ))}
                 
              </div>

               {/* {techIcons && <div className="mt-6 w-full "><IconCloud techIcons={techIcons}/></div>} */}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
