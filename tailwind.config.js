/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        slide: "slide 0.5s ease-in-out",
      },
      keyframes: {
        slide: {
          "0%": { bottom: "-50px" },
          "100%": { transform: "20px" },
        },
      },
    },
  },
  plugins: [],
};
