---
id: technical-frontend
title: Front End
sidebar_label: Front End
---


### Architecture

mAtches uses the React library to implement the front end. Front end currently uses React state for in-app state management. Front end does not cache any values in local or session storage given the limited amount of data being used in a given session.

Additional dependencies can be found in (package.json)[https://github.com/pepfar-datim/mAtches/blob/master/package.json] file. mAtches makes use of Material-UI library for UI components and uses material-table for displaying list of tables on dashboard. The current UI is relatively lightweight given the proof-of-concept nature of the project.

### UI/UX

There are two main views for a user to interact 

A dashboard/main page where users can see list of current maps and add new maps for available questionnaires:

An Individual Map Edit page where users create/edit their mappings:

mAtches is intended to be accessible to users with limited technical expertise and as such implements visual messaging through a variety of approaches including warning messages, color coding, and tooltips to provide additional explanation. As a proof-of-concept project, design principles have not been developed, nor have accessibility guidelines been followed.
