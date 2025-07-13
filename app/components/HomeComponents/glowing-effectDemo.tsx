"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "./glowing-effect";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export function GlowingEffectDemo() {
  return (
    <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
      <GridItem
        area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
        icon={<Box className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Client-First Approach"
        description="Building trust through transparent communication and collaboration."
      />

      <GridItem
        area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
        icon={<Settings className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="- Global Responsiveness"
        description="Available across time zones for seamless worldwide collaboration."
      />

      <GridItem
        area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
        icon={<Lock className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Mordern Tech Stack"
        description="Cutting-edge technologies to craft impactful solutions"
        techIcons={[
          { icon: "/icons/React.svg", name: "React" },
          { icon: "/icons/Javascript.svg", name: "Javascript" },
          { icon: "/icons/TypeScript.svg", name: "TypeScript" },
          { icon: "/icons/nextjs.svg", name: "Next.js" },
          { icon: "/icons/Vue.svg", name: "Vue.js" },
          { icon: "/icons/Nuxt.svg", name: "Nuxt" },
          { icon: "/icons/Svelte.svg", name: "Svelte" },
          { icon: "/icons/Php.svg", name: "Php" },
          { icon: "/icons/Laravel.svg", name: "Laravel" },
          { icon: "/icons/Java.svg", name: "Java.js" },
          { icon: "/icons/Spring.svg", name: "Spring" },
          { icon: "/icons/Python.svg", name: "Python.js" },
        ]}
      />

      <GridItem
        area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
        icon={<Sparkles className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="This card is also built by Cursor"
        description="I'm not even kidding. Ask my mom if you don't believe me."
      />

      <GridItem
        area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
        icon={<Search className="h-4 w-4 text-white dark:text-neutral-400" />}
        title="Coming soon on Aceternity UI"
        description="I'm writing the code as I record this, no shit."
      />
    </ul>
  );
}

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
    <li className={`min-h-[14rem] list-none ${area}`}>
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
              <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-white md:text-2xl/[1.875rem] dark:text-white">
                {title}
              </h3>
              <h2 className="font-sans text-sm/[1.125rem] text-white md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                {description}
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-4 mt-6 ">
                {techIcons &&
                  techIcons.map((tech, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center px-3 py-2.5 rounded-lg border border-gray-600/70 bg-gray-900/40 backdrop-blur-sm hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 shadow-lg"
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
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};
