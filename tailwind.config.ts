import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", ...fontFamily.sans], // Default sans-serif as Poppins
        geistSans: ["var(--font-geist-sans)", "sans-serif"], // GeistSans custom font
        geistMono: ["var(--font-geist-mono)", "monospace"],  // GeistMono custom font
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primaryColor': '#6e41e8',
      },
    },
  },
  plugins: [],
};
export default config;
