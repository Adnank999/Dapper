// "use client";
// import {
//   useMotionValueEvent,
//   useScroll,
//   useTransform,
//   motion,
// } from "motion/react";
// import React, { useEffect, useRef, useState } from "react";

// interface TimelineEntry {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
//   style: string;
//   content: React.ReactNode;
// }

// export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [height, setHeight] = useState(0);

//   useEffect(() => {
//     if (ref.current) {
//       const rect = ref.current.getBoundingClientRect();
//       setHeight(rect.height);
//     }
//   }, [ref]);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start 10%", "end 50%"],
//   });

//   const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
//   const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

//   return (
//     <div
//       className="w-full bg-background dark:bg-neutral-950 font-sans md:px-10"
//       ref={containerRef}
//     >
//       <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
//         <h2 className="text-lg md:text-4xl mb-4 text-highlight dark:text-white max-w-4xl">
//           Changelog from my journey
//         </h2>
//         <p className="text-white/50 dark:text-neutral-300 text-sm md:text-base max-w-sm">
//           I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
//           a timeline of my journey.
//         </p>
//       </div>

//       <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
//         {data.map((item, index) => (
//           <div key={item.id}
//             className="flex justify-start pt-10 md:pt-40 md:gap-10"
//           >
//             <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
//               <div
//                 className="h-12 absolute left-3 md:left-3 w-12 rounded-full dark:bg-black flex items-center justify-center"
//                 style={{
//                   background:
//                     item.style,
//                 }}
//               >
//                 <div className="h-10 p-2 text-white absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-10 rounded-full bg-black dark:bg-black flex items-center justify-center">
//                   {item.icon}
//                 </div>
//               </div>
//               <h3 className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-white/80 dark:text-neutral-500 ">
//                 {item.title}
//               </h3>
//             </div>

//             <div className="relative pl-20 pr-4 md:pl-4 w-full">
//               <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
//                 {item.title}
//               </h3>
//               {item.content}{" "}
//             </div>
//           </div>
//         ))}
//         <div
//           style={{
//             height: height + "px",
//           }}
//           className="absolute md:left-8 left-8 top-0 overflow-hidden w-[14px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
//         >
//           <motion.div
//             style={{
//               height: heightTransform,
//               opacity: opacityTransform,
//             }}
//             className="absolute inset-x-0 top-0  w-[14px] bg-gradient-to-t from-fuchsia-400  via-highlight to-transparent from-[0%] via-[10%] rounded-full"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  id: string;
  title: string;
  icon: React.ReactNode;
  style: string;
  content: React.ReactNode;
}

const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());

  // Refs for each timeline item icon
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  // Intersection Observer to detect when icons come into view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    iconRefs.current.forEach((iconRef, index) => {
      if (iconRef) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              setActiveItems((prev) => {
                const newSet = new Set(prev);
                if (entry.isIntersecting) {
                  newSet.add(data[index].id);
                } else {
                  newSet.delete(data[index].id);
                }
                return newSet;
              });
            });
          },
          {
            // Trigger when 50% of the icon is visible
            threshold: 0.5,
            // Add some margin to trigger the effect slightly before/after
            rootMargin: "-20% 0px -20% 0px",
          }
        );

        observer.observe(iconRef);
        observers.push(observer);
      }
    });

    // Cleanup observers
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [data]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-background dark:bg-neutral-950 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-highlight dark:text-white max-w-4xl">
          Changelog from my journey
        </h2>
        <p className="text-white/50 dark:text-neutral-300 text-sm md:text-base max-w-sm">
          I&apos;ve been working on Aceternity for the past 2 years. Here&apos;s
          a timeline of my journey.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <motion.div
                ref={(el) => (iconRefs.current[index] = el)}
                className="h-12 absolute left-3 md:left-3 w-12 rounded-full flex items-center justify-center"
                animate={{
                  background: activeItems.has(item.id) ? item.style : "#737373", // bg-neutral-500 equivalent
                  scale: activeItems.has(item.id) ? 1.1 : 1,
                  filter: activeItems.has(item.id)
                    ? `brightness(1.2) saturate(1.1)`
                    : "brightness(1) saturate(1)",
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="h-10 p-2 text-white absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-10 rounded-full bg-black dark:bg-black flex items-center justify-center"
                  animate={{
                    backgroundColor: activeItems.has(item.id)
                      ? "#1a1a1a"
                      : "#000000",
                    border: activeItems.has(item.id)
                      ? `1px solid ${item.style}60`
                      : "1px solid transparent",
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    animate={{
                      scale: activeItems.has(item.id) ? 1.05 : 1,
                      filter: activeItems.has(item.id)
                        ? `drop-shadow(0 0 3px ${item.style}80) brightness(1.15)`
                        : "brightness(1)",
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeInOut",
                    }}
                  >
                    {item.icon}
                  </motion.div>
                </motion.div>
              </motion.div>

              <motion.h3
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500"
                animate={{
                  color: activeItems.has(item.id) ? "#ffffff" : "#737373",
                  textShadow: activeItems.has(item.id)
                    ? [
                        "0 0 3px rgba(255, 255, 255, 0.6)",
                        "0 0 6px rgba(255, 255, 255, 0.4)",
                        "0 0 10px rgba(255, 255, 255, 0.3)",
                      ].join(", ")
                    : "none",
                  filter: activeItems.has(item.id)
                    ? "brightness(1.1)"
                    : "brightness(1)",
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                {item.title}
              </motion.h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <motion.h3
                className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500"
                animate={{
                  color: activeItems.has(item.id) ? "#ffffff" : "#737373",
                  textShadow: activeItems.has(item.id)
                    ? [
                        "0 0 3px rgba(255, 255, 255, 0.5)",
                        "0 0 6px rgba(255, 255, 255, 0.3)",
                      ].join(", ")
                    : "none",
                  filter: activeItems.has(item.id)
                    ? "brightness(1.1)"
                    : "brightness(1)",
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                {item.title}
              </motion.h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[6px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[14px] bg-gradient-to-t from-[var(--cyber-a40)] via-[var(--cyber-a30)] via-[var(--cyber-a20)] to-[var(--cyber-a10)] from-[0%] via-[33%] via-[66%] to-[100%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
