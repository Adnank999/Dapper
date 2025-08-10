import IconCloud from "../components/IconCloud";

const techIcons = [
  { icon: "/icons/React.svg", name: "React" },
  { icon: "/icons/Javascript.svg", name: "Javascript" },
  { icon: "/icons/TypeScript.svg", name: "TypeScript" },
  { icon: "/icons/nextjs.svg", name: "Next.js" },
  { icon: "/icons/Python.svg", name: "Python" },
  { icon: "/icons/FastAPI.svg", name: "FastAPI" },
  { icon: "/icons/Nodejs.svg", name: "Node.js" },
  { icon: "/icons/Nuxt.svg", name: "Nuxt" },
  { icon: "/icons/Php.svg", name: "PHP" },
  { icon: "/icons/Spring.svg", name: "Spring" },
  { icon: "/icons/Svelte.svg", name: "Svelte" },
  { icon: "/icons/Python.svg", name: "Python" },
  { icon: "/icons/Laravel.svg", name: "Laravel" },
  { icon: "/icons/Vue.svg", name: "Vue.js" },
  
];

export default async function About() {

    return (
      <div className="flex items-center justify-center min-h-screen">
        <IconCloud techIcons={techIcons} className="border border-gray-300" />
      </div>
    );
}
