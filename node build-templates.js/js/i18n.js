/**
 * This module handles language switching between English and French pages.
 * 
 * Static translations are now handled by Mustache templates in templates/data/
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
    // Set initial language from parameter or detect from URL hash
    if (window.location.hash == "#fr" && currentLang !== 'fr') {
      // Redirect to French page
      window.location.href = "index-fr.html#fr";
      return;
    } else if (window.location.hash == "#en" && currentLang !== 'en') {
      // Redirect to English page  
      window.location.href = "index.html#en";
      return;
    }

    // Set document language
    document.documentElement.lang = currentLang;

    // Add an event listener to the language switcher button
    document.getElementById(buttonId).addEventListener("click", function () {
      const langAlt = this.getAttribute('data-lang-alt');
      if (langAlt === 'fr') {
        window.location.href = "index-fr.html#fr";
      } else {
        window.location.href = "index.html#en";  
      }
    });

    // Run completion callback
    if (onComplete) onComplete();
  };

})();
