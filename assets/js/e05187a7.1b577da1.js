(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{104:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return i})),a.d(t,"metadata",(function(){return s})),a.d(t,"toc",(function(){return l})),a.d(t,"default",(function(){return u}));var n=a(3),r=a(7),o=(a(0),a(111)),i={id:"endUserDoc",title:"End User Documentation",sidebar_label:"End User"},s={unversionedId:"end_user/endUserDoc",id:"end_user/endUserDoc",isDocsHomePage:!1,title:"End User Documentation",description:"Overview",source:"@site/docs/end_user/endUserDoc.md",slug:"/end_user/endUserDoc",permalink:"/mAtches/documentation/docs/end_user/endUserDoc",editUrl:"https://github.com/pepfar-datim/mAtches/edit/master/documentation/docs/end_user/endUserDoc.md",version:"current",sidebar_label:"End User",sidebar:"docs",previous:{title:"Deployment",permalink:"/mAtches/documentation/docs/technical/technical-deployment"},next:{title:"Deployment",permalink:"/mAtches/documentation/docs/implementation/implementation-deployment"}},l=[{value:"Overview",id:"overview",children:[]},{value:"Dashboard",id:"dashboard",children:[{value:"Work with an existing map",id:"work-with-an-existing-map",children:[]},{value:"Create a new map",id:"create-a-new-map",children:[]}]},{value:"Editing a Map",id:"editing-a-map",children:[{value:"Add Headers - CSV",id:"add-headers---csv",children:[]},{value:"Map data values",id:"map-data-values",children:[]}]},{value:"Transforming Data",id:"transforming-data",children:[{value:"Success",id:"success",children:[]},{value:"Troubleshoot Errors",id:"troubleshoot-errors",children:[]}]}],d={toc:l};function u(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},d,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"overview"},"Overview"),Object(o.b)("p",null,"mAtches allows you to map your data to predefined questionnaires that outline data requirements. Your system administrator configures these questionnaires such that the applicable ones are available to you. You can "),Object(o.b)("h2",{id:"dashboard"},"Dashboard"),Object(o.b)("p",null,"When you open mAtches, you will see a dashboard summarizing your existing maps."),Object(o.b)("h3",{id:"work-with-an-existing-map"},"Work with an existing map"),Object(o.b)("p",null,"From the list of maps, you can select a new map to edit (pencil icon), transform data with (upload icon), or delete (trash icon). The transform data will be disabled if your map is not yet completed."),Object(o.b)("h3",{id:"create-a-new-map"},"Create a new map"),Object(o.b)("p",null,"To add a map, you can select from the preloaded questionnaires, select the file type your data is in, and choose a new unique name. You will be brought to the edit page to start working on your map"),Object(o.b)("h2",{id:"editing-a-map"},"Editing a Map"),Object(o.b)("p",null,"Once on the edit page, you can define the headers that you are using in the CSV file you submit and then link them with the Questionnaire items on the right portion of the screen. Note that associations must be unique, linking a header to a second Target System item will result in the first link being broken."),Object(o.b)("h3",{id:"add-headers---csv"},"Add Headers - CSV"),Object(o.b)("h4",{id:"manual"},"Manual"),Object(o.b)("p",null,"You can manually add headers by clickin on the addition icon."),Object(o.b)("h4",{id:"extract-from-a-file"},"Extract from a file"),Object(o.b)("p",null,"Mapping your data - Extracting from a CSV File"),Object(o.b)("h4",{id:"base-on-an-existing-file"},"Base on an existing file"),Object(o.b)("p",null,"If you have an existing map that you want to use as a starting point, you can base your map off an already existing one. All headers from the base map will be added, and headers will be linked if they correspond to an item in the new map."),Object(o.b)("h3",{id:"map-data-values"},"Map data values"),Object(o.b)("p",null,"In order to correctly map your data to the expected format, you also need to map values in cases where a set of specific values is expected. For example, if you are asked to provide the patient\u2019s gender, the expectation may be that you will submit \u201cMale\u201d, \u201cFemale\u201d, \u201cUnknown\u201d. You will be prompted to map these values by a \u201cMap values\u201d button that will appear under relevant Target System items."),Object(o.b)("p",null,"When you click on the \u201cMap values\u201d button for the first time, the default values expected by the Target System are prepopulated. You can clear these out, type your Source System\u2019s value and hit enter to add a new mapping. Please note that these values are case sensitive, so \u201cMale\u201d is not the same as \u201cmale\u201d or \u201cMALE\u201d. "),Object(o.b)("h2",{id:"transforming-data"},"Transforming Data"),Object(o.b)("p",null,"When you are ready to upload your data, you can click on the upload icon next to a map from the Dashboard page, or click on the \u201cUPLOAD DATA\u201d button from the map edit page. These options will be unavailable until your map is completed."),Object(o.b)("h3",{id:"success"},"Success"),Object(o.b)("p",null,"If the data file you submit corresponds to your map, you will get a success message after submitting your data"),Object(o.b)("h3",{id:"troubleshoot-errors"},"Troubleshoot Errors"),Object(o.b)("h4",{id:"header-issues"},"Header Issues"),Object(o.b)("p",null,"If you have unmapped Headers in your file, you will get error/warning messages about Headers missing from the map/CSV file. You will need to fix these issues in your map and/or CSV file."),Object(o.b)("h4",{id:"invalid-data-issues"},"Invalid Data Issues"),Object(o.b)("p",null,"If you have invalid data you will get an error pointing you the relevant row. For example in the example below, there is a problem in row 6 that needs to be found (invalid date has been provided)."))}u.isMDXComponent=!0},111:function(e,t,a){"use strict";a.d(t,"a",(function(){return c})),a.d(t,"b",(function(){return b}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=r.a.createContext({}),u=function(e){var t=r.a.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},c=function(e){var t=u(e.components);return r.a.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,i=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=u(a),m=n,b=c["".concat(i,".").concat(m)]||c[m]||p[m]||o;return a?r.a.createElement(b,s(s({ref:t},d),{},{components:a})):r.a.createElement(b,s({ref:t},d))}));function b(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,i=new Array(o);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var d=2;d<o;d++)i[d]=a[d];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);