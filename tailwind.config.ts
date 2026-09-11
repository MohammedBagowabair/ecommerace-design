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
        /* Cool neutrals — remapped from cream luxury wash */
        cream: {
          DEFAULT: "#FFFFFF",
          50: "#FFFFFF",
          100: "#F5F5F5",
          200: "#E8E8E8",
          300: "#D4D4D4",
        },
        /* Near-black brand / primary CTA (Sephora-like) */
        henna: {
          DEFAULT: "#111111",
          50: "#F5F5F5",
          100: "#EBEBEB",
          200: "#D4D4D4",
          300: "#A3A3A3",
          400: "#737373",
          500: "#404040",
          600: "#111111",
          700: "#0A0A0A",
          800: "#050505",
          900: "#000000",
        },
        /* Soft rose beauty accent — remapped from gold */
        gold: {
          DEFAULT: "#C45C78",
          50: "#FDF2F5",
          100: "#FCE7EC",
          200: "#F9D0DA",
          300: "#F0A8BA",
          400: "#E07A94",
          500: "#C45C78",
          600: "#A84560",
        },
        blush: {
          DEFAULT: "#FDF2F5",
          soft: "#FCE7EC",
        },
        ink: {
          DEFAULT: "#111111",
          muted: "#6B6B6B",
          light: "#9CA3AF",
        },
        rose: {
          DEFAULT: "#C45C78",
          50: "#FDF2F5",
          100: "#FCE7EC",
          200: "#F9D0DA",
          300: "#F0A8BA",
          400: "#E07A94",
          500: "#C45C78",
          600: "#A84560",
          700: "#8B354D",
        },
      },
      fontFamily: {
        arabic: ["var(--font-cairo)", "Tahoma", "sans-serif"],
        display: ["var(--font-display)", "var(--font-cairo)", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        "2xl": "0.75rem",
        "3xl": "1rem",
        "4xl": "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -6px rgba(0, 0, 0, 0.08)",
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)",
        float: "0 12px 40px -8px rgba(0, 0, 0, 0.14)",
        "card-hover": "0 8px 24px -6px rgba(0, 0, 0, 0.1)",
        gallery: "0 1px 2px rgba(0, 0, 0, 0.04)",
      },
      letterSpacing: {
        luxury: "0.06em",
        "luxury-wide": "0.12em",
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
          "0%": { opacity: "0", transform: "translateY(6px)" },
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
        fadeIn: "fadeIn 0.3s ease-out",
        slideUp: "slideUp 0.28s ease-out",
        slideInStart: "slideInStart 0.25s ease-out",
        pulseSoft: "pulseSoft 1.5s ease-in-out infinite",
        badgePop: "badgePop 0.35s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
