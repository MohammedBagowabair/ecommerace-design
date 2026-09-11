import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F5F3EF",
          50: "#FBF9F6",
          100: "#F5F3EF",
          200: "#EBE6DE",
          300: "#DDD6CB",
        },
        henna: {
          DEFAULT: "#4A3228",
          50: "#F6F1EE",
          100: "#EBE1DB",
          200: "#D4C0B5",
          300: "#B89584",
          400: "#8F6554",
          500: "#6B4536",
          600: "#4A3228",
          700: "#3A271F",
          800: "#2A1C16",
          900: "#1A110E",
        },
        gold: {
          DEFAULT: "#C5A059",
          50: "#F9F5EE",
          100: "#F0E8D8",
          200: "#E2D0B0",
          300: "#D0B688",
          400: "#C5A059",
          500: "#B08A45",
          600: "#8F6F38",
        },
        blush: {
          DEFAULT: "#EFE6E0",
          soft: "#F5EEE9",
        },
        ink: {
          DEFAULT: "#2A211C",
          muted: "#6E655E",
          light: "#A39A92",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        display: ["var(--font-display)", "var(--font-cairo)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 32px -8px rgba(42, 33, 28, 0.08)",
        card: "0 4px 20px -4px rgba(42, 33, 28, 0.05), 0 1px 2px rgba(42, 33, 28, 0.03)",
        float: "0 16px 48px -12px rgba(42, 33, 28, 0.12)",
        "card-hover": "0 12px 40px -10px rgba(42, 33, 28, 0.09)",
        gallery: "0 2px 12px -2px rgba(42, 33, 28, 0.04)",
      },
      letterSpacing: {
        luxury: "0.04em",
        "luxury-wide": "0.08em",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      transitionDuration: {
        250: "250ms",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(100%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInStart: {
          "0%": { opacity: "0", transform: "translateX(1.25rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        badgePop: {
          "0%": { transform: "scale(0.6)" },
          "70%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        slideInStart: "slideInStart 0.28s ease-out",
        pulseSoft: "pulseSoft 1.5s ease-in-out infinite",
        badgePop: "badgePop 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
