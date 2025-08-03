import React from "react";
import { Timeline } from "./Timeline";
import { IconBrandLaravel } from "@tabler/icons-react";
import { IconBrandNodejs } from "@tabler/icons-react";
import { IconBrandNextjs } from "@tabler/icons-react";

export function TimelineDemo() {
  const data = [
    {
      id: "1",
      title: "2025",
      icon: <IconBrandLaravel stroke={1} color="#E23A3A" />,
      style:
        "linear-gradient(45deg, oklab(65.4% 0.194 0.132), oklab(85.7% 0.01 0.165))",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white/70 md:text-sm dark:text-neutral-200">
            Built and launched production grade application CanvasCloud an Image
            uploading platform from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              key="img-1"
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-2"
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-3"
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-4"
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      id: "2",
      title: "Early 2025",
      icon: <IconBrandNodejs stroke={2} color="#FFD000" />,
      style:
        "linear-gradient(45deg, oklab(65.4% 0.194 0.132), oklab(85.7% 0.01 0.165))",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-white/70 md:text-sm dark:text-neutral-200">
            Cherry Internet — A Fresh Digital Presence
          </p>
          <p className="mb-8 text-xs font-normal text-white/70 md:text-sm dark:text-neutral-200">
            Redesigned and redeveloped a stunning website for Cherry Internet, a
            local service provider, with a sleek new UI and buttery-smooth
            animations that elevate the brand's modern identity. The refreshed
            interface offers intuitive navigation, faster load times, and an
            engaging user experience tailored for both desktop and mobile users.
            Every pixel pulses with purpose—balancing elegant design with
            functional clarity to help users explore plans, contact support, and
            manage subscriptions effortlessly.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              key="img-5"
              src="https://assets.aceternity.com/templates/startup-1.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-6"
              src="https://assets.aceternity.com/templates/startup-2.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-7"
              src="https://assets.aceternity.com/templates/startup-3.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
            <img
              key="img-8"
              src="https://assets.aceternity.com/templates/startup-4.webp"
              alt="startup template"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    // {
    //   id: "3",
    //   title: "Early 2024",
    //   icon: <IconBrandNextjs stroke={1.5} size={45} />,
    //   style:
    //     "linear-gradient(45deg, oklch(85.4% 0.14 208), oklch(75.7% 0.148 234), oklch(66.4% 0.183 253))",
    //   content: (
    //     <div>
    //       <p className="mb-8 text-xs font-normal text-white/70 md:text-sm dark:text-neutral-200">
          
    //         CraveMap — Discover. Order. Track. Reward.
    //       </p>
    //       <p className="mb-8 text-xs font-normal text-white/70 md:text-sm dark:text-neutral-200">
          
    //         CraveMap is a high-performance food ordering platform uniting
    //         Canada's dynamic restaurant scene under one intuitive frontend
    //         experience. Whether you're craving Montreal poutine or Vancouver
    //         sushi, explore hundreds of local favorites with personalized themes
    //         and lightning-fast performance. Built to delight and optimized to
    //         scale, CraveMap uses Google Cloud's Map and Distance Matrix APIs to
    //         display real-time driver locations and ETA calculations with
    //         stunning accuracy. Users can schedule orders in advance, earn
    //         loyalty points, and unlock exclusive deals via Magic Cards,
    //         enhancing both spontaneity and planning. Powered by DoorDash's API,
    //         the platform guarantees smooth delivery integration and supports
    //         restaurant-specific branding with dynamic theme switching. With
    //         optimized front-end architecture and lean code, users experience
    //         even during dinner rush.
    //       </p>
    //       <div className="grid grid-cols-2 gap-4">
          
    //         <img
    //           key="img-9"
    //           src="https://assets.aceternity.com/pro/hero-sections.png"
    //           alt="hero template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-10"
    //           src="https://assets.aceternity.com/features-section.png"
    //           alt="feature template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-11"
    //           src="https://assets.aceternity.com/pro/bento-grids.png"
    //           alt="bento template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-12"
    //           src="https://assets.aceternity.com/cards.png"
    //           alt="cards template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   id: "4",
    //   title: "Changelog",
    //   icon: <IconBrandLaravel stroke={1} color="#E23A3A" />,
    //   style:
    //     "linear-gradient(45deg, oklab(33.9% 0.094 -0.153), oklab(54.8% 0.142 -0.258), oklab(63.9% 0.231 -0.205), oklab(67.3% 0.275 -0.093), oklab(65.5% 0.261 -0.014))",
    //   content: (
    //     <div>
    //       <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
    //         Deployed 5 new components on Aceternity today
    //       </p>
    //       <div className="mb-8">
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           {/* Removed unnecessary id */}✅ Card grid component
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Startup template Aceternity
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Random file upload lol
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Himesh Reshammiya Music CD
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Salman Bhai Fan Club registrations open
    //         </div>
    //       </div>
    //       <div className="grid grid-cols-2 gap-4">
    //         <img
    //           key="img-13"
    //           src="https://assets.aceternity.com/pro/hero-sections.png"
    //           alt="hero template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-14"
    //           src="https://assets.aceternity.com/features-section.png"
    //           alt="feature template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-15"
    //           src="https://assets.aceternity.com/pro/bento-grids.png"
    //           alt="bento template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           key="img-16"
    //           src="https://assets.aceternity.com/cards.png"
    //           alt="cards template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className=" z-10 relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
