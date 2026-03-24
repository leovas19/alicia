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
        blush: "#e4c7c0",
        cream: "#f7f2e8",
        ink: "#241a17",
        sand: "#dcc9b4",
        wine: "#8f544f",
        gold: "#c6a46c"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(36, 26, 23, 0.08)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        sandFlow: {
          "0%, 100%": { transform: "scaleY(0.4)", opacity: "0.2" },
          "50%": { transform: "scaleY(1)", opacity: "1" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 700ms ease forwards",
        sand: "sandFlow 2.1s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
