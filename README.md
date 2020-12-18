# mAtches

Data source to target mapping utility

**Repo Owner:** Annah Ngaruro [@angaruro](https://github.com/angaruro)

**HOW TO RUN mAtches locally**

A. Fork repo
App is configured to run on port 5001, to change this, edit server.js file, line 6

B. Update config.json file
Change any settings (organization name, appName, FHIR Server) in the config.json file (https://github.com/pepfar-datim/mAtches/blob/master/config.json). A summary of configuration options is provided below:

    "base": If this is "/", mAtches will run at http://localhost:5001/. If this is "/some/other/extension/", mAtches will run at http://localhost:5001/some/other/extension/. Should end in `/`.
    "name": This name will appear in the top-left corner and is the name of the organization/instance for instance of mAtches.
    "appName": This name will appear in the top-left corner. If you use 'mAtches' here, the app will be named mAtches, but you can also rename.
    "allowExternalURL": This is a boolean value (true/false). This property would allow you to send a bundle of questionnaireResponses to an external URL (note this feature is being deprecated)
    "externalMappingLocation": This is the name for an external mapping location. It appears in the button which reads "SUBMIT TO {NAME}".
    "externalMappingLocationURL": This is the URL for an external mapping location (i.e. where the map will be sent when you hit "Submit"). Should end in `/`. You can use the default here for sandbox testing.
    "fhirServer": FHIR server where questionnaires are stored. Should end in `/`. Should end in `/`. You can use the default here for sandbox testing.
    "persistencyLocation": Where maps are persisted locally before they are submitted to external location. Should end in `/`. See notes below for further details on configuring this.

Note on persistency location: the default here is `/usr/local/mAtches/data/`. Regardless of whether you use this default persistency location, or if you choose to configure another location, **you must create a `maps` subdirectory within this location and initiate an empty maps.json file within that `maps` subdirectory.**

If you are using a Unix machine, the following commands can be used to set up the persistency storage (assuming you already have a `/usr/local` directory and wish to use the default location). Note that depending on your settings you may need to run some or all of these commands with `sudo ` before the beginning of the command.

```cd /usr/local/ #go to /usr/local/
mkdir mAtches && cd $_ #create mAtches directory and go there
mkdir data && cd $_ #create data subdirectory and go there
mkdir maps #create maps subdirectory
chmod a+rw maps #give users ability to read/write from files within maps subdirectory
touch fake/maps.json #create empty maps.json file
```

C. Set up and start frontend
<br/>

1. Install dependencies
   `npm install`

2. Run app
   `npm start`
