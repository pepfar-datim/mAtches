describe('The Header Bar', () => {

  it('successfully loads', function() {
    cy.get('[data-cy=headerBar]').should('be', 'visible')
  })

})