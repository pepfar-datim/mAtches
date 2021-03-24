---
id: technical-backend
title: Back End
sidebar_label: Back End
---

### API

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

### Persistency

Persistency of maps is implemented internally (using File System) and externally by sending map to OCL (see also Architecture Summary section above)

Internal persistency is necessary so long as OCL cannot accept an incomplete map. An incomplete map may be one for which Questionnaire Items are not mapped, or  where ValueSet mappings are not provided.

File System persistency for maps uses one file that provides an overall summary of available maps and individual files for each map. For more details on map format, see App Resources section above.