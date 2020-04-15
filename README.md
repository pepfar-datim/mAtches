# mAppr
Data source to target mapping utility

**Repo Owner:** Annah Ngaruro [@angaruro](https://github.com/angaruro)

**HOW TO RUN mAppr locally**

A. Fork repo
App is configured to run on port 5001, to change this, edit server.js file, line 6

B. Update config.json file
Change any settings (organization name, appName, FHIR Server) in the config.json file (https://github.com/pepfar-datim/mAtches/blob/master/config.json)
Note that mAtches app requires a FHIR server to be set up with questionnaires.

C. Set up and start frontend
<br/>


1. Install dependencies
`npm install`

2. Run app
`npm start`

