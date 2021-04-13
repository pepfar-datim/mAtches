---
id: technical-resources
title: App Resources
sidebar_label: App Resources
---

mAtches uses two main resources: questionnaires and maps.

### Questionnaires 

Questionnaires are FHIR Questionnaires and define data requirements for the data that is being collected.

Where data is expected to be restricted to specific values, a FHIR ValueSet is used and is referenced from the relevant Questionnaire.

### Maps 

Maps are mAtches's proprietary instructions for how a user/organization’s proprietary data can be mapped to a specific Questionnaire. Maps allow one to convert data in proprietary format to a FHIR-compliant Bundle of QuestionnaireResponses which corresponds to the relevant Questionnaire.

Maps consist of the following:

- Paths to individual Questionnaire Items (for CSV data, the path is header; for JSON data, a path can be a path to a given value, e.g. person.name.first, or a FHIR path logic definition to access that information) (e.g. look in column with header ‘DOB’ to get data for Questionnaire Item ‘Date of Birth’).
- Constant values to individual Questionnaire items (e.g. ‘ABC123’ is the ‘Facility ID’ for all data values being submitted by use of this map).
- Proprietary definitions to expected values from a ValueSet (e.g. ValueSet expects ‘Female’, but proprietary data uses ‘F’).

More detail on these resources is available (TO MOVE) [here](https://github.com/pepfar-datim/mAtches/wiki/Explanation-of-mAtches-Mapping).

