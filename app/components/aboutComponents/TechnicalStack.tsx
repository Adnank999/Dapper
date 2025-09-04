"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Card, CardContent } from "../ui/Card";
import {
  Brain,
  Code,
  Server,
  Cloud,
  Wrench,
  Coins,
  Sparkles,
} from "lucide-react";
import GlowingCards, { GlowingCard } from "../glowing-card-cards";
import { AnimatedNumber } from "../AnimatedNumber";

interface Technology {
  name: string;
  projects: number;
  proficiency: number;
  description: string;
  color: string;
}

interface TabData {
  id: string;
  label: string;
  icon: React.ReactNode;
  technologies: Technology[];
}

const tabsData: TabData[] = [
  {
    id: "ai-ml",
    label: "AI & Machine Learning",
    icon: <Brain className="w-4 h-4" />,
    technologies: [
      {
        name: "Python",
        projects: 2,
        proficiency: 70,
        description: "Primary language for AI/ML development",
        color: "bg-blue-500",
      },
      {
        name: "TensorFlow",
        projects: 1,
        proficiency: 60,
        description: "Deep learning framework",
        color: "bg-orange-500",
      },
      {
        name: "PyTorch",
        projects: 2,
        proficiency: 75,
        description: "Research-focused ML framework",
        color: "bg-red-500",
      },
      {
        name: "Hugging Face",
        projects: 3,
        proficiency: 70,
        description: "NLP and transformer models",
        color: "bg-yellow-500",
      },
      // {
      //   name: "LangChain",
      //   projects: 15,
      //   proficiency: 85,
      //   description: "LLM application framework",
      //   color: "bg-green-500",
      // },
      {
        name: "OpenAI API",
        projects: 2,
        proficiency: 80,
        description: "GPT integration and fine-tuning",
        color: "bg-purple-500",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend Development",
    icon: <Code className="w-4 h-4" />,
    technologies: [
      {
        name: "React",
        projects: 8,
        proficiency: 80,
        description: "Modern UI library for web applications",
        color: "bg-blue-500",
      },
      {
        name: "Next.js",
        projects: 10,
        proficiency: 92,
        description: "Full-stack React framework",
        color: "bg-gray-800",
      },
      {
        name: "TypeScript",
        projects: 10,
        proficiency: 80,
        description: "Type-safe JavaScript development",
        color: "bg-blue-600",
      },
      {
        name: "Tailwind CSS",
        projects: 10,
        proficiency: 80,
        description: "Utility-first CSS framework",
        color: "bg-teal-500",
      },
      {
        name: "Vue.js",
        projects: 2,
        proficiency: 70,
        description: "Progressive JavaScript framework",
        color: "bg-green-500",
      },
      {
        name: "Svelte",
        projects: 1,
        proficiency: 78,
        description: "Compile-time optimized framework",
        color: "bg-orange-500",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend & APIs",
    icon: <Server className="w-4 h-4" />,
    technologies: [
      {
        name: "Node.js",
        projects: 5,
        proficiency: 80,
        description: "JavaScript runtime for server-side development",
        color: "bg-green-600",
      },
      {
        name: "Express.js",
        projects: 5,
        proficiency: 80,
        description: "Fast web framework for Node.js",
        color: "bg-gray-600",
      },
      {
        name: "PostgreSQL",
        projects: 2,
        proficiency: 80,
        description: "Advanced relational database",
        color: "bg-blue-700",
      },
      {
        name: "MongoDB",
        projects: 2,
        proficiency: 80,
        description: "NoSQL document database",
        color: "bg-green-700",
      },
      {
        name: "GraphQL",
        projects: 1,
        proficiency: 70,
        description: "Query language for APIs",
        color: "bg-pink-500",
      },
      {
        name: "Redis",
        projects: 2,
        proficiency: 80,
        description: "In-memory data structure store",
        color: "bg-red-600",
      },
    ],
  },
  {
    id: "cloud",
    label: "Cloud & DevOps",
    icon: <Cloud className="w-4 h-4" />,
    technologies: [
      {
        name: "AWS",
        projects: 5,
        proficiency: 85,
        description: "Amazon Web Services cloud platform",
        color: "bg-orange-600",
      },
      {
        name: "Docker",
        projects: 1,
        proficiency: 70,
        description: "Containerization platform",
        color: "bg-blue-600",
      },
      {
        name: "Kubernetes",
        projects: 0,
        proficiency: 60,
        description: "Container orchestration system",
        color: "bg-blue-700",
      },
      {
        name: "Vercel",
        projects: 10,
        proficiency: 92,
        description: "Frontend deployment platform",
        color: "bg-black",
      },
      {
        name: "GitHub Actions",
        projects: 3,
        proficiency: 85,
        description: "CI/CD automation platform",
        color: "bg-gray-800",
      },
      // {
      //   name: "Terraform",
      //   projects: 12,
      //   proficiency: 78,
      //   description: "Infrastructure as code tool",
      //   color: "bg-purple-600",
      // },
    ],
  },
  {
    id: "tools",
    label: "Development Tools",
    icon: <Wrench className="w-4 h-4" />,
    technologies: [
      {
        name: "VS Code",
        projects: 50,
        proficiency: 95,
        description: "Primary code editor and IDE",
        color: "bg-blue-600",
      },
      {
        name: "Git",
        projects: 50,
        proficiency: 80,
        description: "Version control system",
        color: "bg-orange-600",
      },
      {
        name: "Figma",
        projects: 2,
        proficiency: 60,
        description: "UI/UX design and prototyping",
        color: "bg-purple-500",
      },
      {
        name: "Postman",
        projects: 25,
        proficiency: 80,
        description: "API development and testing",
        color: "bg-orange-500",
      },
      {
        name: "Webpack",
        projects: 6,
        proficiency: 80,
        description: "Module bundler for JavaScript",
        color: "bg-blue-500",
      },
      {
        name: "ESLint",
        projects: 5,
        proficiency: 80,
        description: "JavaScript linting utility",
        color: "bg-purple-600",
      },
    ],
  },
  // {
  //   id: "web3",
  //   label: "Web3 & Blockchain",
  //   icon: <Coins className="w-4 h-4" />,
  //   technologies: [
  //     {
  //       name: "Solidity",
  //       projects: 15,
  //       proficiency: 82,
  //       description: "Smart contract programming language",
  //       color: "bg-gray-700",
  //     },
  //     {
  //       name: "Ethereum",
  //       projects: 18,
  //       proficiency: 85,
  //       description: "Decentralized blockchain platform",
  //       color: "bg-blue-600",
  //     },
  //     {
  //       name: "Web3.js",
  //       projects: 12,
  //       proficiency: 78,
  //       description: "Ethereum JavaScript API",
  //       color: "bg-orange-500",
  //     },
  //     {
  //       name: "Hardhat",
  //       projects: 10,
  //       proficiency: 75,
  //       description: "Ethereum development environment",
  //       color: "bg-yellow-600",
  //     },
  //     {
  //       name: "IPFS",
  //       projects: 8,
  //       proficiency: 70,
  //       description: "Distributed file storage system",
  //       color: "bg-teal-600",
  //     },
  //     {
  //       name: "MetaMask",
  //       projects: 15,
  //       proficiency: 80,
  //       description: "Crypto wallet integration",
  //       color: "bg-orange-600",
  //     },
  //   ],
  // },
];

const stats = [
  { value: 30, label: "Technologies", color: "text-blue-400" },
  { value: 50, label: "Total Projects", color: "text-purple-400" },
  { value: 4, label: "Years Experience", color: "text-green-400" },
  { value: 8, label: "Certifications", color: "text-red-400" },
];

const tabColors = {
  "ai-ml": "bg-purple-500",
  frontend: "bg-blue-500",
  backend: "bg-green-500",
  cloud: "bg-cyan-500",
  tools: "bg-orange-500",
  web3: "bg-yellow-500",
};

// Add this helper function
const getGlowColor = (colorClass: string): string => {
  const colorMap: { [key: string]: string } = {
    "text-blue-400": "#0080ff", // More electric blue
    "text-green-400": "#00ff80", // Bright neon green
    "text-purple-400": "#8000ff", // Vivid purple
    "text-orange-400": "#ff6600", // Bright orange
    "text-red-400": "#ff3333", // Vibrant red
    "text-yellow-400": "#ffdd00", // Electric yellow
    "text-pink-400": "#ff1493", // Hot pink
    "text-indigo-400": "#4040ff", // Bright indigo
    "text-teal-400": "#00ffcc", // Neon teal
    "text-cyan-400": "#00ccff", // Electric cyan
    // Add more color mappings as needed based on your stat.color values
  };

  return colorMap[colorClass] || "#60a5fa"; // Default fallback
};

export default function TechnicalStack() {
  const [activeTab, setActiveTab] = useState("ai-ml");
  const [animatedProgress, setAnimatedProgress] = useState<
    Record<string, number>
  >({});

  const currentTab = tabsData.find((tab) => tab.id === activeTab);

  useEffect(() => {
    if (currentTab) {
      // Reset all progress to 0
      const initialProgress: Record<string, number> = {};
      currentTab.technologies.forEach((tech) => {
        initialProgress[tech.name] = 0;
      });
      setAnimatedProgress(initialProgress);

      // Animate each technology's progress
      currentTab.technologies.forEach((tech, index) => {
        setTimeout(() => {
          let progress = 0;
          const increment = tech.proficiency / 50; // 50 steps for smooth animation
          const timer = setInterval(() => {
            progress += increment;
            if (progress >= tech.proficiency) {
              progress = tech.proficiency;
              clearInterval(timer);
            }
            setAnimatedProgress((prev) => ({
              ...prev,
              [tech.name]: Math.round(progress),
            }));
          }, 20); // 20ms intervals for smooth animation
        }, index * 100); // Stagger animations by 100ms
      });
    }
  }, [activeTab, currentTab]);

  return (
    <div className="min-h-screen bg-background text-white p-12 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Technical <span className="text-highlight">Stack</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Technologies and tools I use to build innovative solutions
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabsData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
                activeTab === tab.id
                  ? " border-purple-600 text-white"
                  : "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white"
              }`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Technology Cards */}
        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {currentTab?.technologies.map((tech, index) => (
            <Card
              key={tech.name}
              className="bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-colors shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-highlight mb-1">
                      {tech.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <span>{tech.projects} projects</span>
                      <Sparkles className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-200">Proficiency</span>
                    <span className="text-sm font-medium text-white">
                      {animatedProgress[tech.name] || 0}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ease-out ${tabColors[activeTab]}`}
                      style={{
                        width: `${animatedProgress[tech.name] || 0}%`,
                        boxShadow: `0 0 10px ${
                          activeTab === "ai-ml"
                            ? "#a855f7"
                            : activeTab === "frontend"
                            ? "#3b82f6"
                            : activeTab === "backend"
                            ? "#10b981"
                            : activeTab === "cloud"
                            ? "#06b6d4"
                            : activeTab === "tools"
                            ? "#f97316"
                            : "#eab308"
                        }40`,
                      }}
                    />
                  </div>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed">
                  {tech.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <GlowingCards
          enableGlow={true}
          glowRadius={25}
          glowOpacity={0.7}
          animationDuration={400}
          gap="1.5rem"
          responsive={true} // This will use the grid layout
        >
          {stats.map((stat, index) => (
            <GlowingCard
              key={index}
              glowColor={getGlowColor(stat.color)}
              className="bg-transparent border-gray-600 w-full h-full min-h-[120px]" // Add min-height
            >
              <div className="p-6 text-center flex flex-col justify-center h-full">
                <div className={`text-4xl font-bold mb-2 ${stat.color}`}>
                  <AnimatedNumber value={stat.value} />
                  <span className="text-white">+</span>
                </div>

                <div className="text-gray-400 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </GlowingCard>
          ))}
        </GlowingCards>
      </div>
    </div>
  );
}
