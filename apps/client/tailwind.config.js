/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          "0%": { transform: "rotateY(0deg)" },
          "50%": { transform: "rotateY(90deg) scale(125%)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        unflip: {
          "0%": { transform: "rotateY(180deg)" },
          "50%": { transform: "rotateY(90deg) scale(125%)" },
          "100%": { transform: "rotateY(0deg)" },
        },
      },
      animation: {
        flip: "flip 0.3s ease-in-out forwards",
        unflip: "unflip 0.3s ease-in-out forwards",
      },
    },
  },
  plugins: [],
};
