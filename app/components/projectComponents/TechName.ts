export const  techOptions = [
  "Next.js", "React", "Vue", "Nuxt", "Svelte", "SvelteKit",
  "Laravel", "PHP", "JavaScript", "TypeScript", "HTML", "CSS",
  "Tailwind CSS", "Bootstrap", "Astro", "Node.js", "Express",
  "NestJS", "Redux", "Zustand", "Prisma", "MongoDB", "PostgreSQL",
  "MySQL", "GraphQL", "tRPC", "Supabase", "Firebase", "Vite", "Webpack"
].map((tech) => ({
  label: tech,
  value: tech.toLowerCase().replace(/\s+/g, "-"),
}));