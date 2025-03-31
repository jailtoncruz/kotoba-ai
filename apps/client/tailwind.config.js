/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#E63946",  // Vermilion Red
        accent: "#F697AA",   // Sakura Pink
        background: "#FAF3E0", // Off-White
        title: "#C54B63" // Dark Sakura Pink
      },
      fontFamily: {
        zen: ["Zen Maru Gothic", "sans-serif"],
        noto: ["Noto Sans", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        mochiy: ['"Mochiy Pop One"', 'sans-serif'],
      },
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
