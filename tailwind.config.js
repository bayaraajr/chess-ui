// tailwind.config.js
export default {
  darkMode: "class", // enable class-based dark mode
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#DE1A1A",
          DEFAULT: "#DE1A1A",
          dark: "#DE1A1A",
        },
      },
    },
  },
  plugins: [],
};
