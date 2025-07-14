import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        myFontRegular: ["MyFontRegular", "sans-serif"],
        myFontMedium: ["MyFontMedium", "sans-serif"],
        myFontBold: ["MyFontBold", "sans-serif"],
        electricIt: ["ElectricKickIt", "sans-serif"],
        electricNormal: ["ElectricKickNormal", "sans-serif"],
        hijo: ["Hijo", "sans-serif"],
        star: ["StarTrekNormal", "sans-serif"],
        akoni: ["Akoni", "sans-serif"],
        antonellie: ["Antonellie", "sans-serif"],
        clyra: ["Clyra", "sans-serif"],
        argentine: ["Argentine", "sans-serif"],
        gyst: ["Gyst", "sans-serif"],
        mustang: ["Mustang", "sans-serif"],
        xen: ["Xen", "sans-serif"],
        cs: ["CS", "mono"],
        cogin: ["Cogin", "sans-serif"],
        ppEditItalic: ["PpEditItalic", "sans-serif"],
        ppEditRegular: ["PpEditRegular", "sans-serif"],
        ppEditUltraBold: ["PpEditUltraBold", "sans-serif"],
        ppEditUltraThin: ["PpEditUltraThin", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [],
} satisfies Config;
