/**
 * This module takes care of loading the incident history page from GC Articles.
 *
 * It exposes one function at the global scope:
 * - LoadIncidentHistory() - loads the incident history content
 *
 * @todo: Add caching
 */
(async function () {
  const incident_history_pages = {
    en: "https://articles.alpha.canada.ca/notification-gc-notify/wp-json/wp/v2/pages?slug=system-status&lang=en",
    fr: "https://articles.alpha.canada.ca/notification-gc-notify/wp-json/wp/v2/pages?slug=etat-du-systeme&lang=fr",
  };

  /**
   * Get the incident history page from GC Articles and display it
   * @param {string} url - The URL of the incident history page
   * @param {string} loaderId - The ID of the loader element
   * @param {string} contentId - The ID of the content element
   *
   * @returns {void}
   */
  window.LoadIncidentHistory = async function ({ lang, loaderId, contentId }) {
    document.getElementById(contentId).innerHTML = "";
    document.getElementById(loaderId).hidden = false;

    const response = await fetch(incident_history_pages[lang]);
    const incidents = await response.json();
    incident_html = incidents[0].content.rendered;

    // fix up h3's to use tailwind
    incident_html = incident_html.replace(
      /wp-block-heading/g,
      "text-3xl text-gray-800 dark:text-gray-400 font-[425] font-heading leading-none mb-3 mt-10"
    );

    // remove h2
    incident_html = incident_html.replace(/<h2.*\/h2>/g, "");

    document.getElementById(loaderId).hidden = true;
    document.getElementById(contentId).innerHTML = incident_html;
  };
})();
