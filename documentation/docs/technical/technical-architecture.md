---
id: technical-architecture
title: Architecture Summary
sidebar_label: Architecture Summary
---

mAtches is written in JavaScript and currently uses a React-based front end and an Express.js back end. File System is used for internal persistency of user maps as an interim solution. mAtches uses a REST API for communication between the front and back end. mAtches is currently using Node LTS v14.16.0 (active LTS version as of March 2021). If working with mAtches locally, nvm is recommended for node version management. 

mAtches also interacts with a FHIR Server which stores relevant FHIR Questionnaires and with [Open Concept Lab](https://www.openconceptlab.org/) (OCL) which is used to store finalized maps and make them accessible to downstream processes.

The current setup of the interaction between locations and resources can be summarized with the below simplified sequence diagram:
