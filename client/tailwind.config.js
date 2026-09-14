/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff9f6",
          100: "#d7f0e7",
          200: "#aee1d0",
          300: "#7cccb2",
          400: "#49b193",
          500: "#2a9679",
          600: "#1d7a63",
          700: "#186251",
          800: "#154e42",
          900: "#124038",
          950: "#08241f",
        },
        ink: {
          50: "#f6f7f9",
          100: "#eceef2",
          200: "#d5d9e2",
          300: "#adb5c6",
          400: "#7f89a3",
          500: "#5f6a86",
          600: "#4b5570",
          700: "#3d445a",
          800: "#2a2f3e",
          900: "#1b1e29",
          950: "#101219",
        },
        coral: {
          50: "#fff1f0",
          100: "#ffe1de",
          400: "#ff8a7a",
          500: "#f4604b",
          600: "#df4531",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16, 18, 25, 0.04), 0 8px 24px -8px rgba(16, 18, 25, 0.10)",
        popover: "0 12px 40px -12px rgba(16, 18, 25, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0, transform: "translateY(6px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseSoft: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.55 } },
      },
      animation: {
        fadeIn: "fadeIn 0.35s ease-out both",
        pulseSoft: "pulseSoft 1.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
