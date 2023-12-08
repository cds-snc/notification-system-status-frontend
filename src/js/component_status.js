/**
 * This module takes care of loading the component status information
 * from the response.json file.
 */
(async function () {
  const STATUS_DATA_URL = 'https://raw.githubusercontent.com/cds-snc/notification-system-status-frontend/main/response.json';
  const COMPONENTS = {
    'api': {
      id: 'api',
      icon: 'code'
    }, 
    'admin': {
      id: 'admin',
      icon: 'desktop'
    }, 
    'email': {
      id: 'email',
      icon: 'envelope'
    },
    'sms': {
      id: 'sms',
      icon: 'comment'
    }
  };
  const COMPONENT_STATES = {
    'up': {
      text: '<span data-i18n="status_up">Up</span>',
      icon: 'fa-regular fa-circle-check',
      color: 'text-green-700 dark:text-green-300'
    },
    'down': {
      text: '<span data-i18n="status_down">Down</span>',
      icon: 'fa-solid fa-circle-exclamation',
      color: 'text-red-600 dark:text-red-400'
    },
    'degraded': {
      text: '<span data-i18n="status_degraded">Degraded</span>',
      icon: 'fa-solid fa-triangle-exclamation',
      color: 'text-yellow-700 dark:text-yellow-500'
    },
    'unknown': {
      text: '<span data-i18n="status_loading">Loading...</span>',
      icon: 'fa-solid fa-spinner fa-spin',
      color: 'text-neutral-500'
    }
  }
  const COMPONENT_HTML = ({ component_id, component_status }) => `
    <li class="py-3 sm:py-4 outline-offset-6" tabindex="0" id="${component_id}">
      <div class="flex items-start">
        <i class="text-xl mt-1 mr-4 ml-3 fa-solid fa-${COMPONENTS[component_id].icon} text-gray-900 dark:text-white"></i>
        <div class="flex-1 min-w-0 ms-4">
          <p class="text-gray-900 truncate dark:text-white">
            <span data-i18n="${component_id}"></span>
          </p>
          <p class="${component_status.color} font-bold truncate dark:text-gray-400">
            ${component_status.text}
          </p>
        </div>
        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          <i class="${component_status.color} text-2xl ${component_status.icon} mr-4"></i>
        </div>
      </div>
    </li>`;

  // Render the initial component status list
  for (const key in COMPONENTS) {
    const component = COMPONENTS[key];
    document.getElementById('component_status_list').innerHTML += COMPONENT_HTML({
      component_id: component.id,
      component_status: COMPONENT_STATES['unknown'],
    });
  }

  /**
   * Loads the component status information from the response.json file
   * @param {Function} i18n_loader  - Callback function to re-run i18n after statuses are loaded
   */
  window.LoadComponentStatus = async function(i18n_loader) {
    const response = await fetch(STATUS_DATA_URL);
    const component_statuses = await response.json();
    
    document.getElementById('component_status_list').innerHTML = "";
    for (const key in component_statuses) {
      const component = component_statuses[key];
      document.getElementById('component_status_list').innerHTML += COMPONENT_HTML({
        component_id: component.id,
        component_status: COMPONENT_STATES[component.status],
      });
    }

    if (i18n_loader) {
      i18n_loader();
    }
  }
})();
