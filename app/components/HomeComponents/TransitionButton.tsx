// src/TransitionButton.tsx
'use client'
import React, { useState } from 'react';
import './TransitionButton.css'; // Import the CSS file

const TransitionButton: React.FC = () => {
  const [showText, setShowText] = useState(false);
  const [initialScale, setInitialScale] = useState(true); // New state for initial scale

  const longText = `Sound Ethics champions the rights and interests of artists at every turn. Our core mission is to ensure that the creative copyright of artists is respected and protected as artificial intelligence becomes more integrated into the music industry. Through partnerships with educational institutions, legal experts, industry stakeholders, and policy makers we are setting new standards and advocating for policies that protect artists' rights.`;

  const handleClick = async () => {
    console.log("button clicked");
    
    // Use View Transition API if available
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setShowText((prev) => !prev); // Toggle visibility
        setInitialScale(!showText); // Toggle initial scale state
      });
    } else {
      setShowText((prev) => !prev); // Fallback for browsers not supporting View Transition
      setInitialScale(!showText); // Toggle initial scale state
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-sm"
      >
        {showText ? 'Hide Text' : 'Show Text'}
      </button>
      <div className="mt-4">
        <div className={`fade-transition ${showText ? (initialScale ? 'fade-in-start' : 'fade-in') : 'fade-out'}`}>
          {showText && <p>{longText}</p>}
        </div>
      </div>
    </div>
  );
};

export default TransitionButton;
