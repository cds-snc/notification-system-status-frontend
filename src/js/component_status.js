/**
 * This module takes care of loading the component status information
 * from the response.json file.
 */
(async function () {
  const STATUS_DATA_URL = `/response.json?${makeid(10)}`;
  const COMPONENTS = {
    api: {
      id: "api",
      icon: "ph ph-terminal-window",
      name: {
        en: "GC Notify API",
        fr: "API Notification GC"
      }
    },
    admin: {
      id: "admin",
      icon: "ph ph-globe",
      name: {
        en: "GC Notify Website",
        fr: "Site web Notification GC"
      }
    },
    email: {
      id: "email",
      icon: "ph ph-paper-plane-tilt",
      name: {
        en: "Email sending",
        fr: "Envoi de courriel"
      }
    },
    sms: {
      id: "sms",
      icon: "ph ph-chat-text",
      name: {
        en: "Text message sending",
        fr: "Envoi de message texte"
      }
    },
  };
  
  const STATUS_TRANSLATIONS = {
    up: {
      en: "Up",
      fr: "En ligne"
    },
    down: {
      en: "Down", 
      fr: "Hors ligne"
    },
    degraded: {
      en: "Slow",
      fr: "Lent"
    },
    unknown: {
      en: "Loading...",
      fr: "Chargement..."
    }
  };

  const COMPONENT_STATES = {
    up: {
      icon: "ph-fill ph-check-circle",
      color: "text-green-700 dark:text-green-300",
      border: "border-green-500",
    },
    down: {
      icon: "ph-fill ph-x-circle",
      color: "text-red-700 dark:text-red-300",
      border: "border-red-500",
    },
    degraded: {
      icon: "ph-fill ph-warning-circle",
      color: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-500",
    },
    unknown: {
      icon: "animate-spin ph ph-circle-notch",
      color: "text-gray-700 dark:text-gray-300",
      border: "border-gray-300",
    },
  };
  const COMPONENT_HTML = ({ component_id, component_status, lang }) => {
    const currentLang = lang || document.documentElement.lang || 'en';
    const componentName = COMPONENTS[component_id].name[currentLang];
    const statusText = STATUS_TRANSLATIONS[component_status.status || 'unknown'][currentLang];
    
    return `
    <li class="flex items-start p-4 gap-2 bg-white dark:bg-black border-b-8 ${component_status.border}" id="${component_id}">
      <i class="text-3xl ${COMPONENTS[component_id].icon}"></i>
        <div class="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 items-baseline justify-between w-full py-1">
          <span>${componentName}</span>
        
        <div class="flex gap-2 items-center ${component_status.color}">
          ${statusText}
          <i class=" text-2xl ${component_status.icon} mr-4"></i>
        </div></div>
      </li>`;
  };

  // Render the initial component status list
  for (const key in COMPONENTS) {
    const component = COMPONENTS[key];
    const currentLang = document.documentElement.lang || 'en';
    document.getElementById("component_status_list").innerHTML +=
      COMPONENT_HTML({
        component_id: component.id,
        component_status: { ...COMPONENT_STATES["unknown"], status: "unknown" },
        lang: currentLang,
      });
  }

  /**
   * Loads the component status information from the response.json file
   * @param {Function} i18n_loader  - Callback function to re-run i18n after statuses are loaded (no longer used)
   */
  window.LoadComponentStatus = async function (i18n_loader) {
    const response = await fetch(STATUS_DATA_URL);
    const component_statuses = await response.json();
    const currentLang = document.documentElement.lang || 'en';

    document.getElementById("component_status_list").innerHTML = "";
    for (const key in component_statuses) {
      const component = component_statuses[key];
      document.getElementById("component_status_list").innerHTML +=
        COMPONENT_HTML({
          component_id: component.id,
          component_status: { ...COMPONENT_STATES[component.status], status: component.status },
          lang: currentLang,
        });
    }

    // i18n_loader is no longer needed for component status since we handle translations directly
    if (i18n_loader) {
      i18n_loader();
    }
  };

  /**
   * Generates a random string of characters
   * @param {int} length Length of the random string to generate
   * @returns A random string of characters
   */
  function makeid(length) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
})();
