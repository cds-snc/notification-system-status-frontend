const STATUSES = {
  UP: {
    text: 'Up',
    fixture: 'all-up.json',
  },
  DOWN: {
    text: 'Down',
    fixture: 'all-down.json',
  },
  DEGRADED: {
    text: 'Slow',
    fixture: 'all-degraded.json',
  },
  LOADING: {
    text: 'Loading...',
    fixture: 'all-loading.json',
  }
};

/** 
 * Intercepts the 2 external requests the app makes and mocks them
 */
function interceptExternalRequests(fixture1, fixture2) {
  if (!fixture1) fixture1 = 'all-up.json';
  if (!fixture2) fixture2 = 'articles-en.json';

  cy.intercept('/response.json*', { fixture: fixture1 }).as('status_update');
  cy.intercept('GET','https://articles.alpha.canada.ca/notification-gc-notify/wp-json/wp/v2/pages?slug=system-status&lang=en',
    { fixture: fixture2 }
  ).as('articles')
  cy.visit('/');
}

describe('System status', () => {
  context('Component status', () => {
    for (const status in STATUSES) {
      it(`shows all components as ${STATUSES[status].text}`, () => {
        interceptExternalRequests(STATUSES[status].fixture);
        cy.visit('/');

        cy.wait(['@articles', '@status_update']).wait(100);
        cy.getByTestId('component_status_table').should('contain', STATUSES[status].text);
      });
    }
  });

  context('GC articles', () => {
    ['en', 'fr'].forEach(lang => {
      it(`loads in ${lang}`, () => {
        interceptExternalRequests('all-up.json', `articles-${lang}.json`);
        cy.visit('/');
        
        cy.wait('@articles').wait(100);;
        cy.getByTestId('history').should('contain', (lang === 'en' ? 'CYPRESS INCIDENT' : 'INCIDENT CYPRESS'));
      });
    });
  });
  
  context('Bilingualism', () => {
    it('Loads in english', () => {
      interceptExternalRequests();
      cy.visit('/');
      cy.getByTestId('lang_button').should('contain', 'Français');
    });

    it('Switches to french', () => {
      interceptExternalRequests();
      cy.visit('/');
      cy.getByTestId('lang_button').click();
      cy.getByTestId('lang_button').should('contain', 'English');
    });
  });

  context('a11y', () => {
    it('has no detectable a11y violations on load', () => {
      interceptExternalRequests();
      cy.visit('/');
      cy.injectAxe();
      cy.checkA11y();
    });

    it('has no HTML validation errors', () => {
      interceptExternalRequests();
      cy.visit('/');
      cy.htmlvalidate();
    });
  });
})
