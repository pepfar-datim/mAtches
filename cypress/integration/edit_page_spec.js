describe("The Edit Page", () => {
  it("successfully loads", function () {
    cy.seed_incomplete();
    cy.wait(500);
    cy.visit("/maps/gI4MEZ");
    cy.url().should("include", "/maps/gI4MEZ?mode=edit");
  });

  it("has expected mapping value", function () {
    cy.seed_complete();
    cy.visit("/maps/gI4MEZ");
    cy.get("[data-cy=chip_Gender]").should("exist");
  });

  it("can add a header, which should be accessible", function () {
    cy.seed_incomplete();
    cy.visit("/maps/gI4MEZ");
    cy.get("[data-cy=addHeaderInput]")
      .find("input")
      .first()
      .type("testHeader")
      .should("have.value", "testHeader");
    cy.get('[data-cy="addHeaderButton"]').should("be.enabled");
    cy.get('[data-cy="addHeaderButton"]').click();
    cy.get('[data-cy="chip_testHeader"]').should("exist");
    cy.get('[data_cy="/Patient/birthDate_selectItem"]').should("exist");
    cy.get('[data_cy="/Patient/birthDate_selectItem"]')
      .find("div")
      .first()
      .click();
    cy.get('[data-value="testHeader"]').should("exist");
  });

  /*it('removes/assigns header associations correctly', function() {
    cy.seed_complete();
    cy.visit('/maps/gI4MEZ');


  }*/
});
