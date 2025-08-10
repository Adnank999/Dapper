"use client";
import React, { useState, useEffect } from "react";

interface TerminalProps {
  inputText: string;
}

const OutputTerminal: React.FC<TerminalProps> = ({ inputText }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Animate typing effect
  useEffect(() => {
    if (currentIndex < inputText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(inputText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50); // Typing speed
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, inputText]);

  // Reset animation when inputText changes
  useEffect(() => {
    setCurrentIndex(0);
    setDisplayText("");
  }, [inputText]);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div 
        className="border border-white/20 rounded-lg overflow-hidden shadow-2xl"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {/* Terminal Header */}
        <div className="bg-gray-800/90 px-4 py-2 flex items-center gap-2 border-b border-white/10">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="text-white/70 text-sm ml-4 font-mono">
            Shell Terminal
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-4 min-h-[200px] bg-black/50">
          {/* Welcome Message */}
          <div className="text-highlight font-mono text-sm mb-2">
            Welcome to Terminal v1.0
          </div>
          <div className="text-white/60 font-mono text-sm mb-4">
            Type on your keyboard to see the output here...
          </div>
          
          {/* Command Prompt */}
          <div className="flex items-baseline font-mono text-sm">
            <span className="text-green-400 mr-2 flex-shrink-0">
              user@hacker:~$
            </span>
            <div className="flex-1">
              <span className="text-white whitespace-pre-wrap break-words">
                {displayText || "Start typing..."}
              </span>
              <span 
                className={`inline-block w-2 h-5 ml-1 bg-green-400 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
              >
                
              </span>
            </div>
          </div>

          {/* Additional Terminal Lines for Effect */}
          <div className="mt-4 space-y-1 text-white/40 font-mono text-xs">
            <div>Last login: {new Date().toLocaleString()}</div>
            <div>System: Unknown OS</div>
            <div>Status: Ready for input</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputTerminal;
