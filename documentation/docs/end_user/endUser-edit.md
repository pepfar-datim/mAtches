---
id: endUser-edit
title: Editing a Map
sidebar_label: Editing a Map
---

When you start working on a new map, you will be brought to the edit page:
![](/img/endUser/edit/edit-screen.png)

Once on the edit page, you can define the headers that you are using in the CSV file you submit and then link them with the Target Questions on the right-hand side of the screen. 

## Headers - CSV

In order to map your CSV data, you will need to identify the headers that are used in your CSV file. After you have added a header, it will appear on the left-hand side as a chip and will be available on the right-hand side to match with Target Questions. 

### Add Manually

You can manually add headers by clicking on the addition icon. Enter the name of the header and then click the addition icon button.

![](/img/endUser/edit/edit-screen.png)

### Extract from a file

Mapping your data - Extracting from a CSV File

### Base on an existing file

If you have an existing map that you want to use as a starting point, you can base your map off an already existing one. All headers from the base map will be added, and headers will be linked if they correspond to an item in the new map.

### Remove

To remove a header, simply click on the x icon associated with a given header.
![](/img/endUser/edit/remove-header-csv.png)

Note that any existing associations with Target Questions will be removed if you delete a header.

## Making Associations

Note that associations must be unique, linking a header to a second Target Question will result in the first link being broken.

## Map data values

In order to correctly map your data to the expected format, you also need to map values in cases where a set of specific values is expected. For example, if you are asked to provide the patient’s gender, the expectation may be that you will submit “Male”, “Female”, “Unknown”. 

You will be prompted to map these values by a “Map values” button that will appear under relevant Target Questions.

![](/img/endUser/edit/map-values-button.png)

When you click on the “Map values” button for the first time, the default values expected by the Target System are prepopulated. You can type your Source System’s value and hit enter to add a new mapping. 

![](/img/endUser/edit/map-values-screen.png)

You can also upload value mappings from a file. To do so, click on the `Upload Values Map` button.

![](/img/endUser/edit/map-values-upload-button.png)

Please note that value mappings are case sensitive, so “Male” is not the same as “male” or “MALE”. 

If you do not wish to include the default mappings, you will need to remove them before saving and closing.

