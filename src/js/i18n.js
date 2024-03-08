/**
 * This module takes care of switching the UI language between English and French.
 *
 * It exposes one function at the global scope:
 * - SwitchLanguage() - switches language
 * - LoadTranslations() - loads the translations
 */
(function () {
  const STRINGS = {
    legal_label: {
      attr: "aria-label",
      en: "Legal information",
      fr: "Information légale",
    },
    privacy_href: {
      attr: "href",
      en: "https://notification.canada.ca/privacy",
      fr: "https://notification.canada.ca/confidentialite",
    },
    privacy: {
      en: "Privacy",
      fr: "Confidentialité",
    },
    security_href: {
      attr: "href",
      en: "https://notification.canada.ca/security",
      fr: "https://notification.canada.ca/securite",
    },
    security: {
      en: "Security",
      fr: "Sécurité",
    },
    a11y_href: {
      attr: "href",
      en: "https://notification.canada.ca/accessibility",
      fr: "https://notification.canada.ca/accessibilite",
    },
    a11y: {
      en: "Accessibility",
      fr: "Accessibilité",
    },
    terms_href: {
      attr: "href",
      en: "https://notification.canada.ca/terms",
      fr: "https://notification.canada.ca/conditions-dutilisation",
    },
    terms: {
      en: "Terms of use",
      fr: "Conditions d’utilisation",
    },
    sla_href: {
      attr: "href",
      en: "https://notification.canada.ca/service-level-agreement",
      fr: "https://notification.canada.ca/accord-niveaux-de-service",
    },
    sla: {
      en: "Service level agreement",
      fr: "Accord sur les niveaux de service",
    },
    wordmark_alt: {
      attr: "alt",
      en: "Symbol of the Government of Canada",
      fr: "Symbole du Gouvernment du Canada",
    },
    fip_logo_alt: {
      attr: "alt",
      en: "Government of Canada",
      fr: "Gouvernment du Canada",
    },
    fip_logo: {
      attr: "src",
      en: "/assets/fip-en.svg",
      fr: "/assets/fip-fr.svg",
    },
    site_title: {
      en: "GC Notify System Status",
      fr: "État du système Notification GC",
    },
    lang_button: {
      en: "Français",
      fr: "English",
    },
    lang_abbr: {
      en: "FR",
      fr: "EN",
    },
    incident_history_title: {
      en: "Incidents and service interruptions",
      fr: "Incidents et interruptions de service",
    },
    back_title: {
      en: "Back to GC Notify",
      fr: "Retour à Notification GC",
    },
    back_button: {
      en: "Go to GC Notify",
      fr: "Allez à Notification GC",
    },
    api: {
      en: "GC Notify API",
      fr: "API Notification GC",
    },
    admin: {
      en: "GC Notify Website",
      fr: "Site web Notification GC",
    },
    email: {
      en: "Email sending",
      fr: "Envoi de courriel",
    },
    sms: {
      en: "Text message sending",
      fr: "Envoi de message texte",
    },
    status_up: {
      en: "Up",
      fr: "En ligne",
    },
    status_down: {
      en: "Down",
      fr: "Hors ligne",
    },
    status_degraded: {
      en: "Slow",
      fr: "Lent",
    },
    status_loading: {
      en: "Loading...",
      fr: "Chargement...",
    },
  };
  /**
   * Switches the UI language between English and French.
   *
   * @param {buttonId} Id of the UI element to use as the language switcher
   * @param {onComplete} Callback function to run after the language switch
   */
  window.SwitchLanguage = function ({ buttonId, onComplete }) {
    // set the language based on the URL hash
    if (window.location.hash == "#fr") {
      document.documentElement.lang = "fr";
    }
    load_translations(); // load the translations on page load

    // Add an event listener to the language switcher button to trigger
    // the language switch.
    document.getElementById(buttonId).addEventListener("click", function () {
      var lang = document.documentElement.lang || "en";
      if (lang == "en") {
        document.documentElement.lang = "fr";
        window.location.hash = "#fr";
      } else {
        document.documentElement.lang = "en";
        window.location.hash = "#en";
      }
      load_translations();

      if (onComplete) onComplete();
    });

    // run this once at the start (in addition to on every button press)
    onComplete();
  };

  /**
   * Load the translations by iterating through all elements with the `data-i18n`
   * attribute and replacing the innerHTML with the appropriate translation.
   */
  function load_translations() {
    let lang = document.documentElement.lang || "en";
    // Get all data-i18n attributes on el
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      // get all translations keys on the el
      let keys = el.getAttribute("data-i18n").split(" ");
      keys.forEach((key) => {
        // Check if the translation is missing, log an error
        if (!STRINGS[key]) {
          console.error("Missing translation for " + key);
        } else {
          //If translation applies to a specific attr, set it, else set innerHTML
          if (STRINGS[key].attr) {
            el.setAttribute(STRINGS[key].attr, STRINGS[key][lang]);
          } else {
            el.innerHTML = STRINGS[key][lang];
          }
        }
      });
    });
  }
  window.LoadTranslations = load_translations;
})();
