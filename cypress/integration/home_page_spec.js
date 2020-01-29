describe('The Home Page', () => {
  beforeEach(() => {
    cy.seed()
    cy.visit('/')
  })

  //test seeded incomplete map appears and can have data uploaded to it
  //test seeded complete map appears and cannot have data uploded to it
  //test that you can delete a map
  //test that you cannot add a map with an existing name
  //test that you can add a map with a new name


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

  //probably need to rewrite names to deliver the id, so that can use seeding to clear and not have issues with this test
  it('allows you to add a new map (with a new name)', () => {
    cy.request({
      method: 'DELETE',
      url: '/api/maps/gI4MEZ'
    })
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

})