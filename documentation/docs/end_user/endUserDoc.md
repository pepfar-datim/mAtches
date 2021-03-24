---
id: endUserDoc
title: End User Documentation
sidebar_label: End User
---

## Overview

mAtches allows you to map your data to predefined questionnaires that outline data requirements. Your system administrator configures these questionnaires such that the applicable ones are available to you. You can 


## Dashboard

When you open mAtches, you will see a dashboard summarizing your existing maps.

### Work with an existing map

From the list of maps, you can select a new map to edit (pencil icon), transform data with (upload icon), or delete (trash icon). The transform data will be disabled if your map is not yet completed.

### Create a new map

To add a map, you can select from the preloaded questionnaires, select the file type your data is in, and choose a new unique name. You will be brought to the edit page to start working on your map

## Editing a Map

Once on the edit page, you can define the headers that you are using in the CSV file you submit and then link them with the Questionnaire items on the right portion of the screen. Note that associations must be unique, linking a header to a second Target System item will result in the first link being broken.

### Add Headers - CSV

#### Manual

You can manually add headers by clickin on the addition icon.

#### Extract from a file

Mapping your data - Extracting from a CSV File

#### Base on an existing file
If you have an existing map that you want to use as a starting point, you can base your map off an already existing one. All headers from the base map will be added, and headers will be linked if they correspond to an item in the new map.

### Map data values

In order to correctly map your data to the expected format, you also need to map values in cases where a set of specific values is expected. For example, if you are asked to provide the patient’s gender, the expectation may be that you will submit “Male”, “Female”, “Unknown”. You will be prompted to map these values by a “Map values” button that will appear under relevant Target System items.

When you click on the “Map values” button for the first time, the default values expected by the Target System are prepopulated. You can clear these out, type your Source System’s value and hit enter to add a new mapping. Please note that these values are case sensitive, so “Male” is not the same as “male” or “MALE”. 

## Transforming Data

When you are ready to upload your data, you can click on the upload icon next to a map from the Dashboard page, or click on the “UPLOAD DATA” button from the map edit page. These options will be unavailable until your map is completed.

### Success

If the data file you submit corresponds to your map, you will get a success message after submitting your data

### Troubleshoot Errors 

#### Header Issues

If you have unmapped Headers in your file, you will get error/warning messages about Headers missing from the map/CSV file. You will need to fix these issues in your map and/or CSV file.

#### Invalid Data Issues
If you have invalid data you will get an error pointing you the relevant row. For example in the example below, there is a problem in row 6 that needs to be found (invalid date has been provided).
