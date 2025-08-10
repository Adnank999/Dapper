"use client";
import React, { useEffect, useRef } from "react";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import { gsap } from "gsap";
import Terminal from "./Terminal";
import TerminalComponent from "./TerminalComponent";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUser } from "../context/UserContext";
import GlowingKeyboard from "./HomeComponents/GlowingKeyboard";

gsap.registerPlugin(ScrollTrigger);
// Characters to use during randomization
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

// Helper function to get a random character
const randomChar = () =>
  lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];

const ShuffleText: React.FC = () => {
  const textRef = useRef<HTMLDivElement | null>(null);
  
  



  useEffect(() => {
    if (!textRef.current) return;

    // Split into chars first (before any animation)
    const results = Splitting({ target: textRef.current, by: "chars" });
    const chars = results[0].chars;

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

        chars.forEach((char, index) => {
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
      <pre className="ascii text-[8px] sm:text-xs md:text-sm lg:text-base leading-none whitespace-pre-wrap max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto text-center">
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
        className="bio mt-24 font-cs font-stretch-95% uppercase"
        ref={textRef}
      >
        <dt>Name</dt>
        <dd>Adnan Hossain Khan</dd>
        <dt>Profession</dt>
        <dd>Creative FullStack Web Developer</dd>
        <dt>Bio</dt>
        <dd>
          3 years experience - HTML, CSS, JavaScript,Php. Passion for creativity
          in the digital space.Problem solver. Hiker,Photographer,culinary
          enthusiast. Constantly seeking new challenges, growth opportunities.
        </dd>
        {/* <dt>Awards</dt>
        <dd>Best User Experience Design, Webby Awards 2021</dd> */}
      </div>

      {/* <TerminalComponent textRef={textRef} /> */}

       <GlowingKeyboard/>
    </div>
  );
};

export default ShuffleText;
