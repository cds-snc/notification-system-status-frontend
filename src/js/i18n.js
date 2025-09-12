/**
 * This module handles language switching between English and French using a templating approach.
 * English strings appear directly in the HTML/JS, and French translations are loaded from a CSV file
 * to replace them when the language is switched to French.
 *
 * It exposes two functions at the global scope:
 * - SwitchLanguage() - switches language and handles UI logic
 * - LoadTranslations() - loads the translations (now used for backwards compatibility)
 */
(function () {
  let translations = new Map();
  let currentLanguage = 'en';
  let isInitialized = false;

  /**
   * Load translations from the CSV file
   */
  async function loadTranslationsFromCSV() {
    if (isInitialized) return;
    
    try {
      const response = await fetch('/translations.csv');
      const csvText = await response.text();
      
      // Parse CSV (simple parser for this specific format)
      const lines = csvText.split('\n');
      for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV parsing - handles quoted strings with commas
        const match = line.match(/^"([^"]*?)","([^"]*?)"$/);
        if (match) {
          const [, english, french] = match;
          translations.set(english, french);
        }
      }
      isInitialized = true;
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  /**
   * Apply translations to the current page
   */
  function applyTranslations() {
    if (currentLanguage === 'en') return; // No need to translate English
    
    // Store original HTML if not already stored
    if (!document.body.dataset.originalHtml) {
      document.body.dataset.originalHtml = document.body.innerHTML;
    }

    // Apply translations by replacing text content
    document.body.innerHTML = translateHTML(document.body.dataset.originalHtml);
    
    // Update component status if it exists (for dynamically generated content)
    updateComponentTranslations();
    
    // Re-attach event listeners after DOM changes
    attachLanguageToggleListener();
  }

  /**
   * Restore original English content
   */
  function restoreEnglish() {
    if (document.body.dataset.originalHtml) {
      document.body.innerHTML = document.body.dataset.originalHtml;
      // Re-attach event listeners
      attachLanguageToggleListener();
    }
  }

  /**
   * Translate HTML content by replacing English strings with French
   */
  function translateHTML(html) {
    let translatedHTML = html;
    
    for (const [english, french] of translations) {
      // Replace text content, being careful not to break HTML structure
      const regex = new RegExp('>' + escapeRegex(english) + '<', 'g');
      translatedHTML = translatedHTML.replace(regex, '>' + french + '<');
      
      // Replace attribute values
      const attrRegex = new RegExp('="' + escapeRegex(english) + '"', 'g');
      translatedHTML = translatedHTML.replace(attrRegex, '="' + french + '"');
      
      // Replace href attributes
      const hrefRegex = new RegExp('href="' + escapeRegex(english) + '"', 'g');
      translatedHTML = translatedHTML.replace(hrefRegex, 'href="' + french + '"');
      
      // Replace src attributes
      const srcRegex = new RegExp('src="' + escapeRegex(english) + '"', 'g');
      translatedHTML = translatedHTML.replace(srcRegex, 'src="' + french + '"');
      
      // Replace alt attributes
      const altRegex = new RegExp('alt="' + escapeRegex(english) + '"', 'g');
      translatedHTML = translatedHTML.replace(altRegex, 'alt="' + french + '"');
      
      // Replace aria-label attributes
      const ariaLabelRegex = new RegExp('aria-label="' + escapeRegex(english) + '"', 'g');
      translatedHTML = translatedHTML.replace(ariaLabelRegex, 'aria-label="' + french + '"');
    }
    
    return translatedHTML;
  }

  /**
   * Update component translations for dynamically generated content
   */
  function updateComponentTranslations() {
    // Update global COMPONENTS object if it exists
    if (window.COMPONENTS) {
      window.COMPONENTS = {
        api: {
          id: "api",
          icon: "ph ph-terminal-window",
          name: currentLanguage === 'fr' ? (translations.get("GC Notify API") || "API Notification GC") : "GC Notify API"
        },
        admin: {
          id: "admin",
          icon: "ph ph-globe",
          name: currentLanguage === 'fr' ? (translations.get("GC Notify Website") || "Site web Notification GC") : "GC Notify Website"
        },
        email: {
          id: "email",
          icon: "ph ph-paper-plane-tilt",
          name: currentLanguage === 'fr' ? (translations.get("Email sending") || "Envoi de courriel") : "Email sending"
        },
        sms: {
          id: "sms",
          icon: "ph ph-chat-text",
          name: currentLanguage === 'fr' ? (translations.get("Text message sending") || "Envoi de message texte") : "Text message sending"
        },
      };
    }

    // Update global COMPONENT_STATES object if it exists
    if (window.COMPONENT_STATES) {
      window.COMPONENT_STATES = {
        up: {
          text: currentLanguage === 'fr' ? (translations.get("Up") || "En ligne") : "Up",
          icon: "ph-fill ph-check-circle",
          color: "text-green-700 dark:text-green-300",
          border: "border-green-500",
        },
        down: {
          text: currentLanguage === 'fr' ? (translations.get("Down") || "Hors ligne") : "Down",
          icon: "ph-fill ph-x-circle",
          color: "text-red-700 dark:text-red-300",
          border: "border-red-500",
        },
        degraded: {
          text: currentLanguage === 'fr' ? (translations.get("Slow") || "Lent") : "Slow",
          icon: "ph-fill ph-warning-circle",
          color: "text-yellow-700 dark:text-yellow-300",
          border: "border-yellow-500",
        },
        unknown: {
          text: currentLanguage === 'fr' ? (translations.get("Loading...") || "Chargement...") : "Loading...",
          icon: "animate-spin ph ph-circle-notch",
          color: "text-gray-700 dark:text-gray-300",
          border: "border-gray-300",
        },
      };
    }
  }

  /**
   * Escape special regex characters
   */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Attach event listener to language toggle button
   */
  function attachLanguageToggleListener() {
    const langButton = document.getElementById("lang-toggle");
    if (langButton && !langButton.dataset.listenerAttached) {
      langButton.addEventListener("click", handleLanguageToggle);
      langButton.dataset.listenerAttached = "true";
    }
  }

  /**
   * Handle language toggle button click
   */
  function handleLanguageToggle() {
    if (currentLanguage === 'en') {
      currentLanguage = 'fr';
      document.documentElement.lang = 'fr';
      window.location.hash = '#fr';
      applyTranslations();
    } else {
      currentLanguage = 'en';
      document.documentElement.lang = 'en';
      window.location.hash = '#en';
      restoreEnglish();
    }

    // Call onComplete callback if it was provided
    if (window.languageSwitchCallback) {
      window.languageSwitchCallback();
    }
  }

  /**
   * Switches the UI language between English and French.
   *
   * @param {buttonId} Id of the UI element to use as the language switcher
   * @param {onComplete} Callback function to run after the language switch
   */
  window.SwitchLanguage = async function ({ buttonId, onComplete }) {
    // Store the callback for use in event handler
    window.languageSwitchCallback = onComplete;
    
    // Load translations first
    await loadTranslationsFromCSV();
    
    // Set the language based on the URL hash
    if (window.location.hash === "#fr") {
      currentLanguage = 'fr';
      document.documentElement.lang = "fr";
      applyTranslations();
    } else {
      currentLanguage = 'en';
      document.documentElement.lang = "en";
    }

    // Attach event listener to language button
    attachLanguageToggleListener();

    // Run callback once at the start
    if (onComplete) onComplete();
  };

  /**
   * Load the translations (kept for backwards compatibility)
   */
  window.LoadTranslations = function() {
    // This function is now mostly for backwards compatibility
    // The actual translation loading happens in SwitchLanguage
    updateComponentTranslations();
  };
})();
