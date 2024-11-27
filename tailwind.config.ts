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
        background: "#FBF8F0", // Soft cream background
        foreground: "#17222B", // Dark navy text
        primary: {
          DEFAULT: "#86373E", // Rich burgundy
          foreground: "#FBF8F0",
        },
        secondary: {
          DEFAULT: "#44332D", // Warm brown
          foreground: "#FBF8F0",
        },
        accent: {
          DEFAULT: "#F1BD78", // Warm gold
          foreground: "#17222B",
        },
        muted: {
          DEFAULT: "#EFD9C7", // Soft peach
          foreground: "#17222B",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        popover: {
          DEFAULT: "#FBF8F0",
          foreground: "#17222B",
        },
        card: {
          DEFAULT: "#FBF8F0",
          foreground: "#17222B",
        },
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