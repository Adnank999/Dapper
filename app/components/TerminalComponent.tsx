// "use client";
// import React, { useState, useEffect } from "react";
// import Terminal from "react-animated-term";

// interface TerminalComponentProps {
//   inputText: string;
// }

// const TerminalComponent: React.FC<TerminalComponentProps> = ({ inputText = "" }) => {
//   const [showInput, setShowInput] = useState(false);

//   // Static animation lines (never change)
//   const staticTermLines = [
//     { text: "yarn", cmd: true },
//     { text: "yarn install v1.6.0", cmd: false },
//     { text: "[1/4] 🔍  Resolving packages...", cmd: false },
//     { text: "[2/4] 🚚  Fetching 10000 npm packages...", cmd: false },
//     {
//       text: "[3/4] 🔗  Linking dependencies...",
//       cmd: false,
//       frames: [
//         { text: "[------------------------------------------------] 0/1000", delay: 200 },
//         { text: "[#######-----------------------------------------] 100/1000", delay: 2000 },
//         { text: "[###########################---------------------] 500/1000", delay: 200 },
//         { text: "[################################################] 1000/1000", delay: 400 }
//       ]
//     },
//     {
//       text: "[4/4] 📃  Building fresh packages...",
//       cmd: false,
//       frames: [
//         { text: "[------------------------------------------------] 0/1000", delay: 200 },
//         { text: "[#######-----------------------------------------] 100/1000", delay: 300 },
//         { text: "[###########################---------------------] 500/1000", delay: 1200 },
//         { text: "[################################################] 1000/1000", delay: 400 }
//       ]
//     },
//     { text: "✨  Done in 4.91s.", cmd: false }
//   ];

//   // Show input after animation completes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setShowInput(true);
//     }, 8000); // Adjust timing based on your animation
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="mt-10 ml-6 w-[80%]">
//       {/* Debug info */}
//       <div className="mb-4 p-2 bg-gray-800 text-white text-sm">
//         Debug: inputText = "{inputText}" | showInput = {showInput.toString()}
//       </div>
      
//       {/* Terminal window with macOS-style header */}
//       <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
//         {/* Terminal header with traffic lights */}
//         <div className="bg-gray-700 px-4 py-2 flex items-center space-x-2">
//           <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//           <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
//           <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//         </div>
        
//         {/* Terminal content */}
//         <div className="bg-black p-4 font-mono text-sm text-white min-h-[300px]">
//           {/* Static animated terminal - runs once */}
//           <Terminal lines={staticTermLines} interval={80} />
          
//           {/* Dynamic input line - appears after "Done" */}
//           {showInput && (
//             <div className="flex items-center mt-2">
//               <span className="text-white">$ </span>
//               <span className="text-green-400">{inputText}</span>
//               <span className="animate-pulse text-white ml-1">|</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TerminalComponent;

"use client";
import React, { useState, useEffect } from "react";
import Terminal from "react-animated-term";
import "react-animated-term/css/styles.css";

interface TerminalComponentProps {
  inputText: string;
}

const TerminalComponent: React.FC<TerminalComponentProps> = ({ inputText = "" }) => {
  const [showInput, setShowInput] = useState(false);

  // Keep static lines separate - never change these
  const staticTermLines = [
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
        { text: "[################################################] 1000/1000", delay: 400 },
      ],
    },
    {
      text: "[4/4] 📃  Building fresh packages...",
      cmd: false,
      frames: [
        { text: "[------------------------------------------------] 0/1000", delay: 200 },
        { text: "[#######-----------------------------------------] 100/1000", delay: 300 },
        { text: "[###########################---------------------] 500/1000", delay: 1200 },
        { text: "[################################################] 1000/1000", delay: 400 },
      ],
    },
    { text: "✨  Done in 4.91s.", cmd: false },
  ];

  // Show input line after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInput(true);
    }, 8000); // Adjust based on your animation timing
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-10 ml-6 w-[80%]">
      <div className="bg-black rounded-lg p-4 font-mono text-sm text-white">
        {/* Static animated terminal */}
        <Terminal lines={staticTermLines} interval={80} />
        
        {/* Dynamic input line that updates in real-time */}
        {showInput && (
          <div className="flex items-center mt-1 break-all word-break-break-all">
            <span className="text-green-400">$ </span>
            <span className="text-green-400">{inputText}</span>
            <span className="animate-pulse text-green-400 ml-1">|</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalComponent;
