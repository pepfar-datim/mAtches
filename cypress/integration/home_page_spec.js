describe('The Home Page', () => {
  beforeEach(() => {
    cy.seed()
    cy.visit('/')
  })

  it('successfully loads', function() {
    cy.url().should('include', '/maps')
  })

  it('does not allow you to add a new map with an existing name', () => {
    cy.get('#name-entry')
      .type('Cypress-Test')
      .should('have.value', 'Cypress-Test')

    cy.get('#select-questionnaire')
      .click()
      .get('[data-value="HIVque"]')
      .click()

    cy.get('#addMapButton')
      .should('be.disabled')
  })

  it('allows you to add a new map (with a new name)', () => {
    cy.get('#name-entry')
      .type('Cypress-Test2')
      .should('have.value', 'Cypress-Test2')

    cy.get('#select-questionnaire')
      .click()
      .get('[data-value="HIVque"]')
      .click()

    cy.get('#addMapButton')
      .click()
  })    

  it('map is findable in table, editable, deletable, and not uploadable against', () => {
    cy.get('[data-cy=mapsTable]').find('input').first()
      .type('Cypress')
      .should('have.value', 'Cypress')
    cy.get('[data-cy=mapsTable]').find('td')
      .should('contain', 'Cypress-Test')
      .get('[title="Edit Map"]')
      .should('not.be.disabled')
      .get('[title="Upload to map"]')
      .should('be.disabled')
      .get('[title="Delete Map"]')
      .should('not.be.disabled')
  })

})