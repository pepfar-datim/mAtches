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

Cypress.Commands.add('seed_incomplete', () => {
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
		method: 'GET',
		url: '/api/maps/names/' + encodeURI('Cypress-Test')
	})
	.then((response) => {
		if (response.body.hasOwnProperty('uid')) {
			cy.request({
				method: 'DELETE',
				url: '/api/maps/' + response.body.uid
			})
		}	
	})

	cy.request({
		method: 'GET',
		url: '/api/maps/names/' + encodeURI('Cypress-Test2')
	})
	.then((response) => {
		if (response.body.hasOwnProperty('uid')) {
			cy.request({
				method: 'DELETE',
				url: '/api/maps/' + response.body.uid
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

Cypress.Commands.add('seed_complete', () => {
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
		method: 'GET',
		url: '/api/maps/names/' + encodeURI('Cypress-Test')
	})
	.then((response) => {
		if (response.body.hasOwnProperty('uid')) {
			cy.request({
				method: 'DELETE',
				url: '/api/maps/' + response.body.uid
			})
		}	
	})

	cy.request({
		method: 'POST',
		url: '/api/maps/',
		body: {
		  "name": "Cypress-Test",
		  "uid": "gI4MEZ",
		  "questionnaireuid": "HIVque",
		  "complete": true,
		  "map": {
		    "LocationCode": {
		      "path": [
		        {
		          "linkid": "/Encounter",
		          "text": "Encounter"
		        },
		        {
		          "linkid": "/Encounter/location",
		          "text": "Location ID"
		        }
		      ],
		      "valueType": "string"
		    },
		    "PractitionerCode": {
		      "path": [
		        {
		          "linkid": "/Observation",
		          "text": "Practitioner"
		        },
		        {
		          "linkid": "/Observation/performer",
		          "text": "Practitioner ID"
		        }
		      ],
		      "valueType": "string"
		    },
		    "DateObserved": {
		      "path": [
		        {
		          "linkid": "/Observation",
		          "text": "Practitioner"
		        },
		        {
		          "linkid": "/Observation/date",
		          "text": "Observation Date"
		        }
		      ],
		      "valueType": "dateTime"
		    },
		    "VLC": {
		      "path": [
		        {
		          "linkid": "/Observation",
		          "text": "Practitioner"
		        },
		        {
		          "linkid": "/Observation/viralLoad",
		          "text": "Viral Load Count"
		        }
		      ],
		      "valueType": "integer"
		    },
		    "ART_Start": {
		      "path": [
		        {
		          "linkid": "/MedicationStatement",
		          "text": "MedicationStatement"
		        },
		        {
		          "linkid": "/MedicationStatement/startDate",
		          "text": "ART Start Date"
		        }
		      ],
		      "valueType": "dateTime"
		    },
		    "Gender": {
		      "path": [
		        {
		          "linkid": "/Patient",
		          "text": "Patient ID"
		        },
		        {
		          "linkid": "/Patient/gender",
		          "text": "Gender"
		        }
		      ],
		      "valueType": "choice",
		      "choiceMap": {
		        "M": "male",
		        "F": "female",
		        "U": "unknown",
		        "Female": "female",
		        "Féminin": "female"
		      }
		    },
		    "PatientCode": {
		      "path": [
		        {
		          "linkid": "/Patient",
		          "text": "Patient ID"
		        },
		        {
		          "linkid": "/Patient/id",
		          "text": "Patient ID"
		        }
		      ],
		      "valueType": "string"
		    },
		    "DOB": {
		      "path": [
		        {
		          "linkid": "/Patient",
		          "text": "Patient ID"
		        },
		        {
		          "linkid": "/Patient/birthDate",
		          "text": "Birth Date"
		        }
		      ],
		      "valueType": "date"
		    }
		  }		
		}
	})	
})