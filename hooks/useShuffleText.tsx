import { useEffect, useRef } from "react";
import Splitting from "splitting";
import "splitting/dist/splitting.css";
import { gsap } from "gsap";

const lettersAndSymbols = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
  "!", "@", "#", "$", "&", "*", "(", ")", "-", "_", "+", "=", "/", "[", "]", "{", "}", ";", ":", "<", ">", ",",
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "カ", "キ", "ク", "ケ", "コ",
];

// Helper function to get a random character
const randomChar = () =>
  lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];

export const useShuffleText = (isActive: boolean) => {
  const textRef = useRef<HTMLDivElement | null>(null);

  console.log("isActive",isActive)
  useEffect(() => {
    if (isActive) {
      // Clean up Splitting when the animation is inactive
      if (textRef.current) {
        textRef.current.innerHTML = textRef.current.innerHTML; // Reset innerHTML
      }
      return;
    }

    // Apply Splitting
    const results = Splitting({ target: textRef.current, by: "chars" });
    const chars = results[0]?.chars || [];
    const MAX_ITERATIONS = 15;

    // GSAP Animation
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
          setTimeout(randomize, gsap.utils.random(30, 110));
        } else {
          char.textContent = char.dataset.original;
          char.style.color = "";
        }
      };

      setTimeout(() => randomize(), index * 1); // Stagger start time
    });

    return () => {
      // Cleanup Splitting (reset text to its original state)
      if (textRef.current) {
        textRef.current.innerHTML = textRef.current.innerHTML;
      }
    };
  }, [isActive]);

  return textRef;
};
