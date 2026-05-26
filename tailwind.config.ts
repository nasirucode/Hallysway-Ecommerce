import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1rem", lg: "2rem" },
      screens: { "2xl": "1320px" }
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"]
      },
      colors: {
        brand: {
          navy: {
            DEFAULT: "#1d3a6e",
            50: "#eef2f9",
            100: "#d8e0ee",
            200: "#b1c2dd",
            300: "#8aa3cc",
            400: "#5d7fb3",
            500: "#1d3a6e",
            600: "#172f5a",
            700: "#122548",
            800: "#0d1b35",
            900: "#08111f"
          },
          red: {
            DEFAULT: "#e92434",
            50: "#fdecee",
            100: "#fbd0d4",
            200: "#f6a1aa",
            300: "#f17280",
            400: "#ee4856",
            500: "#e92434",
            600: "#bf1d2a",
            700: "#951620",
            800: "#6b1017",
            900: "#420a0e"
          },
          cream: "#FBF5EC",
          gold: "#c9a14a",
          tea: "#5a7a3a"
        }
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(29, 58, 110, 0.18)",
        glow: "0 0 0 1px rgba(233, 36, 52, 0.15), 0 12px 40px -8px rgba(233, 36, 52, 0.35)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(60% 70% at 50% 0%, rgba(233,36,52,0.18) 0%, rgba(29,58,110,0.0) 60%), radial-gradient(80% 80% at 100% 100%, rgba(29,58,110,0.25) 0%, rgba(29,58,110,0) 70%)"
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "shine": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "blob": {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%": { transform: "translate(30px,-20px) scale(1.05)" },
          "66%": { transform: "translate(-20px,20px) scale(0.95)" }
        }
      },
      animation: {
        "fade-in-up": "fade-in-up .7s ease-out both",
        marquee: "marquee 40s linear infinite",
        shine: "shine 2.4s linear infinite",
        blob: "blob 14s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
