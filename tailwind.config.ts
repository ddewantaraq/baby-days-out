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
        "baby-blue": "#87CEFA",
        "baby-pink": "#FFB6C1",
        "sunny-yellow": "#FFEB3B",
        "playful-green": "#66BB6A",
      },
    },
  },
  
  plugins: [],
} satisfies Config;
