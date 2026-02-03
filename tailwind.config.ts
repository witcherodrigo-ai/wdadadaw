import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f19",
        surface: "#121826",
        "surface-alt": "#0f1524",
        accent: "#6d6bff",
        "accent-2": "#4cc2ff",
        border: "#1f2a44"
      },
      boxShadow: {
        glow: "0 0 20px rgba(109, 107, 255, 0.35)",
        card: "0 20px 60px rgba(5, 11, 24, 0.6)"
      }
    }
  },
  plugins: []
};

export default config;
