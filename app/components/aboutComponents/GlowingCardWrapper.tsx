"use client";
import React from "react";
import {GlowingCards,GlowingCard} from "../glowing-card-cards";
import { Crown } from "lucide-react";

const GlowingCardWrapper = () => {
  return (
    <div className="">
      <GlowingCards>
        <GlowingCard 
          glowColor="#10b981" 
          className="min-w-[10rem] max-w-[12rem]" // Custom width
        >
          <h3>Performance</h3>
          <p>Lightning-fast components...</p>
        </GlowingCard>
        <GlowingCard 
          glowColor="#8b5cf6"
          className="min-w-[10rem] max-w-[12rem]" // Custom width
        >
          <h3>Design</h3>
          <p>Beautiful, accessible components...</p>
        </GlowingCard>
      </GlowingCards>
     
      <GlowingCards
        enableGlow={true}
        glowRadius={30}
        glowOpacity={0.8}
        animationDuration={500}
        gap="2rem" // Also reduced gap
        responsive={true}
      >
        <GlowingCard 
          glowColor="#f59e0b" 
          className="space-y-4 min-w-[10rem] max-w-[14rem]" // Custom width
        >
          <div className="flex items-center space-x-2">
            <Crown className="w-6 h-6 text-amber-500" />
            <h3>Premium Features</h3>
          </div>
          <p>Enterprise-grade components...</p>
        </GlowingCard>
      </GlowingCards>
    </div>
  );
};


export default GlowingCardWrapper;
