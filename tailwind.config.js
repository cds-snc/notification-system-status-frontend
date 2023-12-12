/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,js}"],
  theme: {
    colors: {
      white: "white",
      black: "black",
      transparent: "transparent",
      current: "currentColor",
      gray: {
        100: "#F0F2F5",
        200: "#CFD5DD",
        300: "#AFB9C3",
        400: "#909CA8",
        500: "#737F8C",
        600: "#5E6975",
        700: "#49535D",
        800: "#343C45",
        900: "#21262C",
      },
      blue: {
        200: "#D7E5F5",
        500: "#004AB2",
        600: "#6584A6",
        700: "#425A76",
        800: "#31455C",
        900: "#26374A",
      },
      notify: {
        200: "#C1E8FA",
        300: "#8CD0F2",
        400: "#6DA8D3",
        600: "#4E7BA2",
        700: "#304760",
      },
      red: {
        300: "#F7796E",
        500: "#D74D42",
        700: "#A62A1E",
        800: "#711810",
        900: "#330D09",
      },
      green: {
        300: "#40BF75",
        500: "#29A35A",
        700: "#03662A",
      },
      yellow: {
        300: "#EBC247",
        500: "#B88E0F",
        700: "#705400",
      },
      lime: {
        300: "#9DC059",
        500: "#7E9F3C",
        700: "#45610E",
      },
    },
    extend: {
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
