import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "#ececec",
        foreground: "#1b1d1a",
        primary: {
          DEFAULT: "#ec5030",
          foreground: "#ececec",
        },
        secondary: {
          DEFAULT: "#50787e",
          foreground: "#ececec",
        },
        accent: {
          DEFAULT: "#a4d4dd",
          foreground: "#1b1d1a",
        },
        muted: {
          DEFAULT: "#ececec",
          foreground: "#1b1d1a",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "#ececec",
          foreground: "#1b1d1a",
        },
        card: {
          DEFAULT: "#ececec",
          foreground: "#1b1d1a",
        },
      },
      fontFamily: {
        mono: ['"Roboto Mono"', 'monospace'],
      },
      keyframes: {
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
