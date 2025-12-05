import type { Config } from "tailwindcss";

export default {
  darkMode: "class", 
  content: [
    "./app/**/*.{ts,tsx,js,jsx}",
    "./components/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
