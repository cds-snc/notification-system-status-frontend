/**
 * This module handles language switching between English and French pages.
 * 
 * Static translations are now handled by Mustache templates in src/templates/data/
 * Dynamic translations are handled directly in component_status.js
 *
 * It exposes one function at the global scope:
 * - SwitchLanguage() - switches language by navigating between pages
 */
(function () {
  /**
   * Switches the UI language between English and French.
   * Now works with server-generated pages for static content.
   *
   * @param {string} buttonId Id of the UI element to use as the language switcher
   * @param {string} currentLang Current page language
   * @param {Function} onComplete Callback function to run after the language switch
   */
  window.SwitchLanguage = function ({ buttonId, currentLang, onComplete }) {
    // Set initial language from parameter or detect from URL path
    const currentPath = window.location.pathname;
    if (currentPath === "/fr" && currentLang !== 'fr') {
      // Already on French page, just reload with correct language
      window.location.reload();
      return;
    } else if (currentPath === "/en" && currentLang !== 'en') {
      // Already on English page, just reload with correct language
      window.location.reload();
      return;
    }

    // Set document language
    document.documentElement.lang = currentLang;

    // Add an event listener to the language switcher button
    document.getElementById(buttonId).addEventListener("click", function () {
      const langAlt = this.getAttribute('data-lang-alt');
      if (langAlt === 'fr') {
        window.location.href = "/fr";
      } else {
        window.location.href = "/en";  
      }
    });

    // Run completion callback
    if (onComplete) onComplete();
  };

})();
