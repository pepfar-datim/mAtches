---
id: technical
title: Technical Documentation
sidebar_label: Technical
---

## Code

mAtches is an open-source project. Our repo is avaialable [here](https://github.com/pepfar-datim/mAtches)

## Architecture Summary

mAtches is written in JavaScript and currently uses a React-based front end and an Express.js back end. File System is used for internal persistency of user maps as an interim solution. mAtches uses a REST API for communication between the front and back end. mAtches is currently using Node LTS v14.16.0 (active LTS version as of March 2021). If working with mAtches locally, nvm is recommended for node version management. 

mAtches also interacts with a FHIR Server which stores relevant FHIR Questionnaires and with [Open Concept Lab](https://www.openconceptlab.org/) (OCL) which is used to store finalized maps and make them accessible to downstream processes.

The current setup of the interaction between locations and resources can be summarized with the below simplified sequence diagram:



## App Resources

mAtches uses two main resources: questionnaires and maps.

### Questionnaires 

Questionnaires are FHIR Questionnaires and define data requirements for the data that is being collected

Where data is expected to be restricted to specific values, a FHIR ValueSet is used and is referenced from the relevant Questionnaire

### Maps 

Maps are mAtches' proprietary instructions for how a user/organization’s proprietary data can be mapped to a specific Questionnaire. Maps allow you to map

Paths to individual Questionnaire Items (in current iteration, mAtches only accepts CSV, so the path is a header) (e.g. look in column with header ‘DOB’ to get data for Questionnaire Item ‘Date of Birth’)
Constant values to individual Questionnaire items (e.g. ‘ABC123’ is the ‘Facility ID’ for all data values being submitted by use of this map)
Proprietary definitions to expected values from a ValueSet (e.g. ValueSet expects ‘Female’, but proprietary data uses ‘F’)

More detail on these resources is available (TO MOVE) [here](https://github.com/pepfar-datim/mAtches/wiki/Explanation-of-mAtches-Mapping).

## Front end

### Architecture

mAtches uses the React library to implement the front end. Front end currently uses React state for in-app state management. Front end does not cache any values in local or session storage given the limited amount of data being used in a given session.

Additional dependencies can be found in (package.json)[https://github.com/pepfar-datim/mAtches/blob/master/package.json] file. mAtches makes use of Material-UI library for UI components and uses material-table for displaying list of tables on dashboard. The current UI is relatively lightweight given the proof-of-concept nature of the project.

### UI/UX

There are two main views for a user to interact 

A dashboard/main page where users can see list of current maps and add new maps for available questionnaires:

An Individual Map Edit page where users create/edit their mappings:

mAtches is intended to be accessible to users with limited technical expertise and as such implements visual messaging through a variety of approaches including warning messages, color coding, and tooltips to provide additional explanation. As a proof-of-concept project, design principles have not been developed, nor have accessibility guidelines been followed.

## Back end

The mAtches back end is written in Express. The back-end implements endpoints in line with REST API principles.

The back end’s entry point provides an overview of available api routes: [server.js](https://github.com/pepfar-datim/mAtches/blob/master/server/server.js)

Here is an overview of available api/endpoints and supported requests

| Endpoint | Supported Requests | Purpose |
| ---- | -- | ----|
| api/questionnaires | GET | Get all questionnaires |
| api/questionnaires/:id |GET | Get specific questionnaire |
| api/maps | GET, POST, PUT | Get all maps, add or update a map |
| api/maps/:id | GET, DELETE |Get/Delete specific map |
| api/maps/names/:name | GET | Check if map name is in use |
| api/about | GET | Get basic information on mAtches (including version number and build date) |

## Persistency

Persistency of maps is implemented internally (using File System) and externally by sending map to OCL (see also Architecture Summary section above)

Internal persistency is necessary so long as OCL cannot accept an incomplete map. An incomplete map may be one for which Questionnaire Items are not mapped, or  where ValueSet mappings are not provided.

File System persistency for maps uses one file that provides an overall summary of available maps and individual files for each map. For more details on map format, see App Resources section above.

## User Management / Authentication

User Management requirements are under development. We plan to use [Keycloak](https://www.keycloak.org/) for user authorization and are evaluating its ability to meet requirements for user management/authentication. 

In the current proof-of-concept test stage, the app is not being used with any real data. As such, sensitive data should not be processed in the current version of the app.

## Deployment

See Implementation documentation for details on deploying mAtches.

For instructions on how to run the app locally, please see the repo's [README](https://github.com/pepfar-datim/mAtches).