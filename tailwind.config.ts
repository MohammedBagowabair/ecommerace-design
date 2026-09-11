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
          DEFAULT: "#F7F5F1",
          50: "#FDFCFA",
          100: "#F7F5F1",
          200: "#EFEAE3",
          300: "#E4DDD3",
        },
        henna: {
          DEFAULT: "#6B3E2E",
          50: "#F7F0ED",
          100: "#EDE0D9",
          200: "#D4B5A8",
          300: "#B88874",
          400: "#8F5A45",
          500: "#6B3E2E",
          600: "#5A3326",
          700: "#45271D",
          800: "#2F1A14",
          900: "#1C100C",
        },
        gold: {
          DEFAULT: "#B8956A",
          50: "#F8F4EE",
          100: "#F0E8DA",
          200: "#E0D0B5",
          300: "#CDB48B",
          400: "#B8956A",
          500: "#A07D52",
          600: "#856643",
        },
        blush: {
          DEFAULT: "#F0E4DE",
          soft: "#F5EBE6",
        },
        ink: {
          DEFAULT: "#1C1917",
          muted: "#6B6560",
          light: "#A39E98",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 8px 30px -6px rgba(28, 25, 23, 0.10)",
        card: "0 2px 16px -2px rgba(28, 25, 23, 0.06), 0 1px 3px rgba(28, 25, 23, 0.04)",
        float: "0 12px 40px -10px rgba(28, 25, 23, 0.16)",
        "card-hover": "0 12px 36px -8px rgba(28, 25, 23, 0.12)",
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
