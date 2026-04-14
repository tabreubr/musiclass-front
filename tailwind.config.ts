import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#60A5FA",
          dark: "#1E3A5F",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#EFF6FF",
        },
        background: "#F8FAFC",
        border: "#E2E8F0",
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
        },
        status: {
          passed: "#22C55E",
          pending: "#F59E0B",
          failed: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.06)",
        nav: "0 -2px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
