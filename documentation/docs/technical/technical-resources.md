---
id: technical-resources
title: App Resources
sidebar_label: App Resources
---

mAtches uses two main resources: questionnaires and maps.

### FHIR Resources 

mAtchs uses FHIR Questionnaires to define data requirements for the data that is being collected. FHIR Questionnaires are stored on a FHIR Server which is specified in mAtches' configuration file. Creation of questionnaires occurs outside of mAtches and organizations can make use of publicly available tools (for example QuestionnaireBuilder) for this.

In addition, mAtches can transform data into a FHIR Bundle of FHIR QuestionnaireResponses.

For more detail on the FHIR Resources used by mAtches and how they differ from standard FHIR Resources, it is recommended that you refer to the StructureDefinition for each FHIR Resource.

### Maps 

Maps are mAtches's proprietary instructions for how a user/organization’s proprietary data can be mapped to a specific Questionnaire. Maps allow one to convert data in proprietary format to a FHIR-compliant Bundle of QuestionnaireResponses which corresponds to the relevant Questionnaire.

Maps consist of the following:

- Paths to individual Questionnaire Items (for CSV data, the path is header; for JSON data, a path can be a path to a given value, e.g. person.name.first, or a FHIR path logic definition to access that information) (e.g. look in column with header ‘DOB’ to get data for Questionnaire Item ‘Date of Birth’).
- Constant values to individual Questionnaire items (e.g. ‘ABC123’ is the ‘Facility ID’ for all data values being submitted by use of this map).
- Proprietary definitions to expected values from a ValueSet (e.g. ValueSet expects ‘Female’, but proprietary data uses ‘F’).

More detail on mAtches map format is available [here](/docs/technical/technical-map-file).
