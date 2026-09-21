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
          50: "#fffdf0",
          100: "#fff9c2",
          200: "#fff085",
          300: "#ffe043",
          400: "#fcc814",
          500: "#f5b108",
          600: "#d99203",
          700: "#b06f04",
          800: "#8f5509",
          900: "#76440e",
          950: "#422304",
        },
        peach: {
          50: "#fff7f2",
          100: "#ffede0",
          200: "#fedbc4",
          300: "#fcbe9a",
          400: "#f9996b",
          500: "#f2723c",
          600: "#df5222",
          700: "#ba3d17",
          800: "#953317",
          900: "#7a2c16",
          950: "#42140a",
        },
        ink: {
          50: "#fffbf5",
          100: "#f7f0e6",
          200: "#ede0cf",
          300: "#d8c5af",
          400: "#a8937d",
          500: "#7c6853",
          600: "#5f4f3e",
          700: "#473b2e",
          800: "#31271e",
          900: "#221a14",
          950: "#17110c",
        },
        coral: {
          50: "#fff2f0",
          100: "#ffe3df",
          400: "#ff7866",
          500: "#ee4f3b",
          600: "#d63723",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(60, 40, 20, 0.05), 0 8px 24px -8px rgba(242, 114, 60, 0.08)",
        popover: "0 14px 42px -12px rgba(60, 40, 20, 0.18)",
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
