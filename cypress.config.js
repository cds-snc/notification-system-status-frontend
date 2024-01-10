const { defineConfig } = require("cypress");
const htmlvalidate = require("cypress-html-validate/plugin");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    viewportWidth: 1280,
    viewportHeight: 850,
    setupNodeEvents(on, config) {
      htmlvalidate.install(on,  {
        rules: {
          "require-sri": "off",
        },
      });
    },
  },
});
