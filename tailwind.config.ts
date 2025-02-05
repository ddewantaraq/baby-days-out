import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#FF6347", 
      },
      fontFamily: {
        sans: ['var(--font-jersey15)'],
        jersey: ['var(--font-jersey15)'],
      },
    },
  },
  plugins: [],
} satisfies Config;
