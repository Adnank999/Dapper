import IconCloud from "../components/IconCloud";

const techIcons = [
  { icon: "/icons/React.svg", name: "React" },
  { icon: "/icons/Javascript.svg", name: "Javascript" },
  { icon: "/icons/TypeScript.svg", name: "TypeScript" },
  { icon: "/icons/nextjs.svg", name: "Next.js" },
  { icon: "/icons/Python.svg", name: "Python" },
  { icon: "/icons/FastAPI.svg", name: "FastAPI" },
  { icon: "/icons/Nodejs.svg", name: "Node.js" },
  { icon: "/icons/Framer.svg", name: "Framer" },
  { icon: "/icons/React.svg", name: "React" },
  { icon: "/icons/Javascript.svg", name: "Javascript" },
  { icon: "/icons/TypeScript.svg", name: "TypeScript" },
  { icon: "/icons/nextjs.svg", name: "Next.js" },
  { icon: "/icons/Python.svg", name: "Python" },
  { icon: "/icons/FastAPI.svg", name: "FastAPI" },
  { icon: "/icons/Nodejs.svg", name: "Node.js" },
  { icon: "/icons/Framer.svg", name: "Framer" },
  { icon: "/icons/React.svg", name: "React" },
  { icon: "/icons/Javascript.svg", name: "Javascript" },
  { icon: "/icons/TypeScript.svg", name: "TypeScript" },
  { icon: "/icons/nextjs.svg", name: "Next.js" },
  { icon: "/icons/Python.svg", name: "Python" },
  { icon: "/icons/FastAPI.svg", name: "FastAPI" },
  { icon: "/icons/Nodejs.svg", name: "Node.js" },
  { icon: "/icons/Framer.svg", name: "Framer" },
];

export default async function About() {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconCloud techIcons={techIcons} className="border border-gray-300" />
      </div>
    );
}
