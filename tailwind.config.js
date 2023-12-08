/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Noto Sans", "Arial", "sans-serif"],
      body: ["Noto Sans", "Arial", "sans-serif"],
      monospace: ["Noto Sans Mono"],
      heading: ["Noto Sans Display"],
    },
    outline: {
      yellow: "3px solid var(--focus-outline)",
    },
    spacing: {
      gutter: "1.875rem", // 30px
      gutterHalf: "0.9375rem", // 15px
      gutterAndAHalf: "2.8125rem", // 45px
      doubleGutter: "3.75rem", // 60px
    },
    width: {
      "5/8": "62.5%",
    },
    maxWidth: {
      "80ch": "80ch",
    },
    minHeight: {
      target: "45px",
    },
  },
  plugins: [
    plugin(function ({ addVariant, e }) {
      addVariant("link", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`link${separator}${className}`)}:link`;
        });
      });
    }),
  ],
};
