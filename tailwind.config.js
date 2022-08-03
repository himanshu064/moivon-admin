/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--theme-black)",
        secondary: "var(--theme-white)",
        main: "var(--theme-black)",
        background: "var(--theme-black)",
        "primary-light": "var(--theme-black-light)",
        "secondary-light": "var(--theme-white-light)",
        active: "var(--color-active)",
      },
      backgroundColor: {
        primary: "var(--theme-black)",
        secondary: "var(--theme-white)",
        main: "var(--theme-black)",
        background: "var(--theme-black)",
        "primary-light": "var(--theme-black-light)",
        "secondary-light": "var(--theme-white-light)",
        active: "var(--color-active)",
      },
    },
  },
  plugins: [],
};
