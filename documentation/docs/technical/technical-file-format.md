---
id: technical-map-file
title: Proprietary Mapping format
sidebar_label: Proprietary Mapping format
---

mAtches uses a proprietary format (a map) for storing instructions on how to transform users' data into a QuestionnaireResponse corresponding to the related FHIR Questionnaire.

## Higher-Level Properties
Maps have the following properties:

| property | description |
| --- | --------- |
| **name** | a user-defined name for the map (must be unique) |
| **created** | ISO date for when map was created |
| **updated** | ISO date for when map was last updated |
| **uid** | a unique 6-character alphanumeric string |
| **questionnaireuid** | id for the questionnaire the map is linked to. We are currently using url values here, but this depends on the questionnaire ids specified by an organization in the questionnaires uploaded to the FHIR server which stores questionnaires |
| **complete** | a boolean that records whether a map has satistfied minimum requirements for mappings. To be complete, all required questionnaire items must be mapped. For CSV files, there is a further restriction that there be no unmapped headers (that is a user cannot define a header that they don't plan to use when mapping data) |
| **fileType** | a string value which is either `csv` or `json` (the two supported file types) |
| **headersStructure** | this property is present on maps with `json` filetype. It is an array of objects which specifies the format of the file the user is mapping against. |
| **logic** | this property is present on maps with `json` filetype. It specifies any logic rules for the mappings. Currently, mAtches allows user to specify logic conditions on an array of objects. For example, given the following array `[{"quality": "fluffy", "animal": "dog"}, {"quality": "spikey", "animal": "hedgehog"}]`, mAtches allows you to specify logic to specify that the user wants to take the value from `animal` on the object where `quality` equals `fluffy` (in this case, this resolves to `dog`) |
| **map** |the actual map which stores the instructions for mapping to the relevant FHIR Questionnaire (see below for more details) |

## Map-Level Properties

The actual instructions to map the propietary data to the FHIR Questionnaire items is contained in the `map` property.
Within the map property, there are two subproperties: `headers` and `constants`. `headers` provide the instructions to the data that is present within the data that will be transformed. The `constants` are used to define situations where a FHIR Questionnaire item uses a constant value.

### headers
Each property in `headers` is a reference to a header (for csv file type) or a path to a value (for json file type) that is used when retrieving the data that should be mapped to the FHIR QuestionnaireResponse.
Note that for csv files, all headers must be mapped. For json files, all valid paths will be present under `headers`, but it is not required that they be mapped.

| property | description |
| --- | --------- |
| **headerPath** | an array of strings that specifies the path to the item being mapped. For example, if the fileType is csv, and the header to be mapped is `DateOfBirth`, the headerPath will be `['DateOfBirth']`. If the fileType is json, and the path to the value is `patient.name.first`, the headerPath is `['patient','name','first']` |
| **path** | this is the path to the FHIR Questionnaire item being mapped to |
| **valueType** | the valueType of the Questionnaire item|
| **choiceMap** | this is present if the valueType is choice and provides a mapping to valid choice values. An example is `"F"": {"code": "Female", "valueType": "choice"}`; here the user has indicated that the value `F` in their system corresponds to the expected value of `Female` as defined by the FHIR Questionnaire item's `answerValueSet` or `answerOption` |
| **logic** | this is present if value is being provided by way of a logic definition defined for mapping (only applicable for json files). In this case, the "header" will refer to the alias of the logic definition. See below for details on structure |

### constants

Each property in `constants` is a reference to the last `linkid` in a FHIR Questionnaire item's path. For example, if a FHIR item has a path that ends with a `linkid` of `Patient/ID` and this item is mapped to a constant, then the `constants` property will have a property `Patient/ID`

Within each property of the `constants` resource, one can find the following properties:

| property | description |
| --- | --------- |
| **display** | the mapping constant as it is displayed on the front end. If a user specifies that a patientID is always `123`, `123` will be saved here |
| **code** | a code for the mapping constant. This is relevant if the item is a `choice` value type, in which case the display value may differ from the code. If user defines (rather than selects) the constant, this will be the same as display.  |
| **valueType** | the valueType of the Questionnaire item |
| **path** | this is the path from the FHIR Questionnaire item for which a constant is being provided |

### logic definitions

The logic definitions use the format specified below. For simplification purposes, imagine that we have an array of objects `[{"quality": "fluffy", "animal": "dog"}, {"quality": "spikey", "animal": "hedgehog"}]`, and we want to us the value from `animal` on the object where `quality` equals `fluffy` (in this case, this resolves to `dog`).


| property | description |
| --- | --------- |
| **operator** | the following operators are allowed: `eq` (equals), `gt` (greater than), `lt` (less than). The first value that satisfies a given logic condition is selected |
| **logicKey** | the property against which the logic is checked. In the example, this is `quality` |
| **logicCondition** | the value the logicKey must satisfy. In the example, this is `fluffy` |
| **selectKey** | the property from which value is taken if logic is fulfilled. In the example, this is `animal` |
| **alias** | A user specified name for this logic definition (used within UI); defaults to fhirPath if not provided |
| **fhirPath** | fhirPath definition of logic rule |
| **headerPath** | path to the parent property on which this logic rule is applied |
| **itemPath** | specifies the path for accessing the item as used in headersStructure |
| **id** | six-character alphanumeric generated by mAtches for managing logic definitions |