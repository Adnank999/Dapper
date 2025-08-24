"use client";
import React, { useEffect, useRef } from "react";

import { gsap } from "gsap";
import TerminalComponent from "./TerminalComponent";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUser } from "../context/UserContext";
import GlowingKeyboard from "./HomeComponents/GlowingKeyboard";
import useIsMobile from "@/hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

const lettersAndSymbols = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "!",
  "@",
  "#",
  "$",
  "&",
  "*",
  "(",
  ")",
  "-",
  "_",
  "+",
  "=",
  "/",
  "[",
  "]",
  "{",
  "}",
  ";",
  ":",
  "<",
  ">",
  ",",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "カ",
  "キ",
  "ク",
  "ケ",
  "コ",
];


const randomChar = () =>
  lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];

const ShuffleText: React.FC = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();
  const renderChars = (text: string) => {
    return text.split("").map((char, index) => (
      <span
        key={`char-${index}`}
        className="char"
        data-original={char}
     
      >
        {char}
      </span>
    ));
  };
  useEffect(() => {
    if (!textRef.current) return;

  

    const chars = Array.from(
      textRef.current.querySelectorAll(".char")
    ) as HTMLElement[];

    // Initially hide text
    gsap.set(textRef.current, { opacity: 0 });

    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 70%",
      once: true,
      markers: false,
      onEnter: () => {
        // Animate opacity to 1
        gsap.to(textRef.current, {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        });

        // Begin randomizing characters *while fading in*
        const MAX_ITERATIONS = 10;

        chars?.forEach((char, index) => {
          let iteration = 0;
          const originalText = char.textContent || "";
          char.dataset.original = originalText;

          const randomize = () => {
            if (iteration < MAX_ITERATIONS) {
              char.textContent = randomChar();
              char.style.color = ["#2b4539", "#61dca3", "#61b3dc"][
                Math.floor(Math.random() * 3)
              ];
              iteration++;
              setTimeout(randomize, gsap.utils.random(15, 35));
            } else {
              char.textContent = originalText;
              char.style.color = "";
            }
          };

          // Stagger character animations slightly
          setTimeout(() => randomize(), index * 5);
        });
      },
    });
  }, []);

  return (
    <div className="absolute top-0 min-h-screen font-cs font-xs ">
      <pre className="ascii text-[8px] sm:text-xs leading-none whitespace-pre-wrap max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto text-center">
        {`              .'   .*'   \`*.   \`. ; / .'    .*'\`-.
            .'   .'         \\    \\ : /   .*'      \`-.
          /    /            ,   ',          -.      \`.
          /    /      _.._   :   '.   .-*""*-.    \`.   \\
        /   .'    .-'    \`-.   '/ .'         \`-.   \\   \\
        ,  ,'   .'   .*""*-.\,: ,.-*"*-.        \`.       .
          /   .'   .'       \`  \`        \`.        \`.
      '     /    /                       \`.        \\ .   \`
      ,     .    /                          \\        \\ \`   ;
      :         ,                            \\    :   \\ \`  :
      ;    .                                  \\    .   \\ \\ |
      | '  :   ,                               .    \\   ; ;:
      |:   ;                                      \`  \\  : ;|
      ||   |  ;                                 .     ; ; ;;
      ;:   |  |                                    \`  ; | ||
      L.\\  |  |  .d$$s.                    .s$$b..  ; : |.:J
    / __\`';  | *'   \`*Tb._            _.dP*'   \`*  | | :__ \\
    ..' .\`.:  |         \`*Ts'        \`sP*'        ; |   '. \`,,
    ;  /   ,  ;   .+s**s.   \`.           .s**s+.  :_;-.'  \\  :
    : ,   /:; :   \\ *ss* \\    ;         / *ss* /    +: \\   . ;
    .\`  :  :  ,  .+s$$$s+.            .+s$$$s+.  .* ;  ;  ',
      \\   *.   ;*d$P*"$$$T$b  ,+**+,  d$P*"$$$T$b*   .*    /
      \\     ; ::$; +:$$$:$$;*      *:$; +:$$$:$$;  :     /
            :   T$b._$$$d$P          T$b._$$$d$P   ;
        \`._.;  ; \`*T$$$P*'            \`*T$$$P*'    :._.'
            |; :             '                     |   \`.
            ;:  \\           :.     ,               : \`.  \\
            \` \\  \`._        \`*.__.*'               '   \\  \\
              . *--*'           ""                 ,     ;  .
              \\                                  / .       :
                \\          .+*"*--*"*+.          /   \`      |
                \`.       :._.--..--._.;       .';    ;  :  ;
                  ;.      \`.        .'      .'  |    |  ,
                  : \`.      \`*----*'      .'    |    |    :
                  |   \`.                .'      |    :   .
                  :     \`.            .'        :    '  / \`.
                  /        \`-.      .-'          /\`. / .'    \`.
                /            \`****'            .        \`.    \\
              .'                              ,    '  \\   \\    \\
            _.'                                    /    :   .    ,
      _.-*' \`.                               :   :     |   :    :
              \`-.                                .         ;    |
                  \`-.                        .-\`           ,     ;
                    \`.     \`.     .*      .'   \`.   \`.  .'     ,
                      \`.     \`-  '      .'       \`.          .'
                        \`.            .'          \`+._     / \`.
                          \`.        .'             :     / .    \\
                            \`.    .'               |    :  ;     .
                              \`..'                 :    ;    \`   ;
                                                    .   :     ;  :
                                                      \\   \`   /   ;
                                                      \`.  \\     /
                                                        \`-.\  .'`}
      </pre>
      <div
        className="bio mt-8 sm:mt-16 md:mt-24 lg:mt-32 font-cs uppercase px-4 sm:px-6 md:px-8 lg:px-0"
        ref={textRef}
      >
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl xl:max-w-6xl mx-auto">
          {/* Large Screen Grid Layout */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24 lg:space-y-0 space-y-6 sm:space-y-8">
            {/* Left Column */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              {/* Name Section */}
              <div className="border-l-2 lg:border-l-4 border-green-400 pl-4 lg:pl-8 hover:border-green-300 transition-colors duration-300">
                <dt className="text-xs sm:text-sm lg:text-base xl:text-lg text-green-400 font-light tracking-wider mb-1 lg:mb-3">
                  {renderChars("Name")}
                </dt>
                <dd className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl text-white font-medium leading-tight lg:leading-snug">
                    {renderChars("Adnan Hossain Khan")}
                </dd>
              </div>

              {/* Profession Section */}
              <div className="border-l-2 lg:border-l-4 border-blue-400 pl-4 lg:pl-8 hover:border-blue-300 transition-colors duration-300">
                <dt className="text-xs sm:text-sm lg:text-base xl:text-lg text-blue-400 font-light tracking-wider mb-1 lg:mb-3">
                  {renderChars("Profession")}
                </dt>
                <dd className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl text-white font-medium leading-tight lg:leading-snug">
                  {renderChars("Creative FullStack Web Developer")}
                </dd>
              </div>
            </div>

            {/* Right Column - Bio Section */}
            <div className="border-l-2 lg:border-l-4 border-purple-400 pl-4 lg:pl-8 hover:border-purple-300 transition-colors duration-300">
              <dt className="text-xs sm:text-sm lg:text-base text-purple-400 font-light tracking-wider mb-2 lg:mb-4">
                Bio
              </dt>
              <dd className="text-xs text-gray-300 leading-relaxed lg:leading-loose font-light space-y-3 lg:space-y-4">
                <span className="block">
                  3 years experience - HTML, CSS, JavaScript, PHP.
                </span>
                <span className="block">
                  Passion for creativity in the digital space.
                </span>
                <span className="block">
                  Problem solver. Hiker, Photographer, culinary enthusiast.
                </span>
                <span className="block">
                  Constantly seeking new challenges, growth opportunities.
                </span>
              </dd>
            </div>
          </div>

          {/* Optional: Decorative Elements for Large Screens */}
          <div className="hidden lg:flex justify-center items-center mt-16 space-x-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent"></div>
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* <TerminalComponent textRef={textRef} /> */}

      {!isMobile && <GlowingKeyboard />}
    </div>
  );
};

export default ShuffleText;
