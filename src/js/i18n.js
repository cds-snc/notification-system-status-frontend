/** 
 * This module takes care of switching the UI language between English and French.
 */
(function () {
    const STRINGS = {
        site_title: {
            en: "GC Notify System Status",
            fr: "État du système GC Notify",
        },
        lang_button: {
            en: "Français",
            fr: "English",
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
            en: "Take me back!",
            fr: "Reprends moi !",
        },
    }
    window.SwitchLanguage = function({ buttonId, onComplete }) {
        
        // Iterate through all elements with the `data-i18n` attribute and replace
        // the innerHTML with the appropriate translation.
        function load_translations() {
            document.querySelectorAll('[data-i18n]').forEach(function (el) {
                var key = el.getAttribute('data-i18n');
                var lang = document.documentElement.lang || 'en';
                el.innerHTML = STRINGS[key][lang];
            });
        }

        // set the language based on the URL hash
        if (window.location.hash == '#fr') {
            document.documentElement.lang = 'fr';
        }
        load_translations(); // load the translations on page load
        
        // Add an event listener to the language switcher button to trigger
        // the language switch.
        document.getElementById(buttonId).addEventListener("click", function () {
            var lang = document.documentElement.lang || 'en';
            if (lang == 'en') {
                document.documentElement.lang = 'fr';
                window.location.hash = '#fr';
            } else {
                document.documentElement.lang = 'en';
                window.location.hash = '#en';
            }
            load_translations();

            if (onComplete)
                onComplete();
        });

        // run this once at the start (in addition to on every button press)
        onComplete();
    }
})();
