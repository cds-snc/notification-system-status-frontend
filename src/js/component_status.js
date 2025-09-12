/**
 * This module takes care of loading the component status information
 * from the response.json file.
 */
(async function () {
  const STATUS_DATA_URL = `/response.json?${makeid(10)}`;
  
  // Expose COMPONENTS globally so i18n can update translations
  window.COMPONENTS = {
    api: {
      id: "api",
      icon: "ph ph-terminal-window",
      name: "GC Notify API"
    },
    admin: {
      id: "admin",
      icon: "ph ph-globe",
      name: "GC Notify Website"
    },
    email: {
      id: "email",
      icon: "ph ph-paper-plane-tilt",
      name: "Email sending"
    },
    sms: {
      id: "sms",
      icon: "ph ph-chat-text",
      name: "Text message sending"
    },
  };
  
  // Expose COMPONENT_STATES globally so i18n can update translations
  window.COMPONENT_STATES = {
    up: {
      text: 'Up',
      icon: "ph-fill ph-check-circle",
      color: "text-green-700 dark:text-green-300",
      border: "border-green-500",
    },
    down: {
      text: 'Down',
      icon: "ph-fill ph-x-circle",
      color: "text-red-700 dark:text-red-300",
      border: "border-red-500",
    },
    degraded: {
      text: 'Slow',
      icon: "ph-fill ph-warning-circle",
      color: "text-yellow-700 dark:text-yellow-300",
      border: "border-yellow-500",
    },
    unknown: {
      text: 'Loading...',
      icon: "animate-spin ph ph-circle-notch",
      color: "text-gray-700 dark:text-gray-300",
      border: "border-gray-300",
    },
  };
  const COMPONENT_HTML = ({ component_id, component_status }) => `
  <li class="flex items-start p-4 gap-2 bg-white dark:bg-black border-b-8 ${component_status.border}" id="${component_id}">
    <i class="text-3xl ${window.COMPONENTS[component_id].icon}"></i>
      <div class="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-2 items-baseline justify-between w-full py-1">
        <span>${window.COMPONENTS[component_id].name}</span>
      
      <div class="flex gap-2 items-center ${component_status.color}">
        ${component_status.text}
        <i class=" text-2xl ${component_status.icon} mr-4"></i>
      </div></div>
    </li>`;

  // Render the initial component status list
  for (const key in window.COMPONENTS) {
    const component = window.COMPONENTS[key];
    document.getElementById("component_status_list").innerHTML +=
      COMPONENT_HTML({
        component_id: component.id,
        component_status: window.COMPONENT_STATES["unknown"],
      });
  }

  /**
   * Loads the component status information from the response.json file
   * @param {Function} i18n_loader  - Callback function to re-run i18n after statuses are loaded
   */
  window.LoadComponentStatus = async function (i18n_loader) {
    const response = await fetch(STATUS_DATA_URL);
    const component_statuses = await response.json();

    document.getElementById("component_status_list").innerHTML = "";
    for (const key in component_statuses) {
      const component = component_statuses[key];
      document.getElementById("component_status_list").innerHTML +=
        COMPONENT_HTML({
          component_id: component.id,
          component_status: window.COMPONENT_STATES[component.status],
        });
    }

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
