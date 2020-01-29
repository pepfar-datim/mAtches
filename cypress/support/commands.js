// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('seed', () => {
	cy.request({
		method: 'GET',
		url: '/api/maps/gI4MEZ'
	})
	.then((response) => {
		if (response.body) {
			cy.request({
				method: 'DELETE',
				url: '/api/maps/gI4MEZ'
			})
		}	
	})

			cy.request({
			method: 'POST',
			url: '/api/maps/',
			body: {
				name: 'Cypress-Test',
				uid: 'gI4MEZ',
				questionnaireuid: 'HIVque',
				complete: false,
				map:{}			
			}
		})	
})