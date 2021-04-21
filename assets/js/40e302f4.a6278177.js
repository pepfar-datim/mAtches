(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{78:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return l})),a.d(t,"metadata",(function(){return o})),a.d(t,"toc",(function(){return b})),a.d(t,"default",(function(){return c}));var n=a(3),r=a(7),i=(a(0),a(97)),l={id:"technical-map-file",title:"Proprietary Mapping format",sidebar_label:"Proprietary Mapping format"},o={unversionedId:"technical/technical-map-file",id:"technical/technical-map-file",isDocsHomePage:!1,title:"Proprietary Mapping format",description:"mAtches uses a proprietary format (a map) for storing instructions on how to transform users' data into a QuestionnaireResponse corresponding to the related FHIR Questionnaire.",source:"@site/docs/technical/technical-map-file.md",slug:"/technical/technical-map-file",permalink:"/mAtches/docs/technical/technical-map-file",editUrl:"https://github.com/pepfar-datim/mAtches/edit/master/documentation/docs/technical/technical-map-file.md",version:"current",sidebar_label:"Proprietary Mapping format",sidebar:"docs",previous:{title:"App Resources",permalink:"/mAtches/docs/technical/technical-resources"},next:{title:"User Management",permalink:"/mAtches/docs/technical/technical-usermanagement"}},b=[{value:"Higher-Level Properties",id:"higher-level-properties",children:[]},{value:"Map-Level Properties",id:"map-level-properties",children:[{value:"headers",id:"headers",children:[]},{value:"constants",id:"constants",children:[]},{value:"logic definitions",id:"logic-definitions",children:[]}]}],p={toc:b};function c(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(i.b)("wrapper",Object(n.a)({},p,a,{components:t,mdxType:"MDXLayout"}),Object(i.b)("p",null,"mAtches uses a proprietary format (a map) for storing instructions on how to transform users' data into a QuestionnaireResponse corresponding to the related FHIR Questionnaire."),Object(i.b)("h2",{id:"higher-level-properties"},"Higher-Level Properties"),Object(i.b)("p",null,"Maps have the following properties:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:null},"property"),Object(i.b)("th",{parentName:"tr",align:null},"description"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"name")),Object(i.b)("td",{parentName:"tr",align:null},"a user-defined name for the map (must be unique)")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"created")),Object(i.b)("td",{parentName:"tr",align:null},"ISO date for when map was created")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"updated")),Object(i.b)("td",{parentName:"tr",align:null},"ISO date for when map was last updated")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"uid")),Object(i.b)("td",{parentName:"tr",align:null},"a unique 6-character alphanumeric string")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"questionnaireuid")),Object(i.b)("td",{parentName:"tr",align:null},"id for the questionnaire the map is linked to. We are currently using url values here, but this depends on the questionnaire ids specified by an organization in the questionnaires uploaded to the FHIR server which stores questionnaires")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"complete")),Object(i.b)("td",{parentName:"tr",align:null},"a boolean that records whether a map has satistfied minimum requirements for mappings. To be complete, all required questionnaire items must be mapped. For CSV files, there is a further restriction that there be no unmapped headers (that is a user cannot define a header that they don't plan to use when mapping data)")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"fileType")),Object(i.b)("td",{parentName:"tr",align:null},"a string value which is either ",Object(i.b)("inlineCode",{parentName:"td"},"csv")," or ",Object(i.b)("inlineCode",{parentName:"td"},"json")," (the two supported file types)")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"headersStructure")),Object(i.b)("td",{parentName:"tr",align:null},"this property is present on maps with ",Object(i.b)("inlineCode",{parentName:"td"},"json")," filetype. It is an array of objects which specifies the format of the file the user is mapping against.")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"logic")),Object(i.b)("td",{parentName:"tr",align:null},"this property is present on maps with ",Object(i.b)("inlineCode",{parentName:"td"},"json")," filetype. It specifies any logic rules for the mappings. Currently, mAtches allows user to specify logic conditions on an array of objects. For example, given the following array ",Object(i.b)("inlineCode",{parentName:"td"},'[{"quality": "fluffy", "animal": "dog"}, {"quality": "spikey", "animal": "hedgehog"}]'),", mAtches allows you to specify logic to specify that the user wants to take the value from ",Object(i.b)("inlineCode",{parentName:"td"},"animal")," on the object where ",Object(i.b)("inlineCode",{parentName:"td"},"quality")," equals ",Object(i.b)("inlineCode",{parentName:"td"},"fluffy")," (in this case, this resolves to ",Object(i.b)("inlineCode",{parentName:"td"},"dog"),")")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"map")),Object(i.b)("td",{parentName:"tr",align:null},"the actual map which stores the instructions for mapping to the relevant FHIR Questionnaire (see below for more details)")))),Object(i.b)("h2",{id:"map-level-properties"},"Map-Level Properties"),Object(i.b)("p",null,"The actual instructions to map the propietary data to the FHIR Questionnaire items is contained in the ",Object(i.b)("inlineCode",{parentName:"p"},"map")," property.\nWithin the map property, there are two subproperties: ",Object(i.b)("inlineCode",{parentName:"p"},"headers")," and ",Object(i.b)("inlineCode",{parentName:"p"},"constants"),". ",Object(i.b)("inlineCode",{parentName:"p"},"headers")," provide the instructions to the data that is present within the data that will be transformed. The ",Object(i.b)("inlineCode",{parentName:"p"},"constants")," are used to define situations where a FHIR Questionnaire item uses a constant value."),Object(i.b)("h3",{id:"headers"},"headers"),Object(i.b)("p",null,"Each property in ",Object(i.b)("inlineCode",{parentName:"p"},"headers")," is a reference to a header (for csv file type) or a path to a value (for json file type) that is used when retrieving the data that should be mapped to the FHIR QuestionnaireResponse.\nNote that for csv files, all headers must be mapped. For json files, all valid paths will be present under ",Object(i.b)("inlineCode",{parentName:"p"},"headers"),", but it is not required that they be mapped."),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:null},"property"),Object(i.b)("th",{parentName:"tr",align:null},"description"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"headerPath")),Object(i.b)("td",{parentName:"tr",align:null},"an array of strings that specifies the path to the item being mapped. For example, if the fileType is csv, and the header to be mapped is ",Object(i.b)("inlineCode",{parentName:"td"},"DateOfBirth"),", the headerPath will be ",Object(i.b)("inlineCode",{parentName:"td"},"['DateOfBirth']"),". If the fileType is json, and the path to the value is ",Object(i.b)("inlineCode",{parentName:"td"},"patient.name.first"),", the headerPath is ",Object(i.b)("inlineCode",{parentName:"td"},"['patient','name','first']"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"path")),Object(i.b)("td",{parentName:"tr",align:null},"this is the path to the FHIR Questionnaire item being mapped to")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"valueType")),Object(i.b)("td",{parentName:"tr",align:null},"the valueType of the Questionnaire item")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"choiceMap")),Object(i.b)("td",{parentName:"tr",align:null},"this is present if the valueType is choice and provides a mapping to valid choice values. An example is ",Object(i.b)("inlineCode",{parentName:"td"},'"F"": {"code": "Female", "valueType": "choice"}'),"; here the user has indicated that the value ",Object(i.b)("inlineCode",{parentName:"td"},"F")," in their system corresponds to the expected value of ",Object(i.b)("inlineCode",{parentName:"td"},"Female")," as defined by the FHIR Questionnaire item's ",Object(i.b)("inlineCode",{parentName:"td"},"answerValueSet")," or ",Object(i.b)("inlineCode",{parentName:"td"},"answerOption"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"logic")),Object(i.b)("td",{parentName:"tr",align:null},'this is present if value is being provided by way of a logic definition defined for mapping (only applicable for json files). In this case, the "header" will refer to the alias of the logic definition. See below for details on structure')))),Object(i.b)("h3",{id:"constants"},"constants"),Object(i.b)("p",null,"Each property in ",Object(i.b)("inlineCode",{parentName:"p"},"constants")," is a reference to the last ",Object(i.b)("inlineCode",{parentName:"p"},"linkid")," in a FHIR Questionnaire item's path. For example, if a FHIR item has a path that ends with a ",Object(i.b)("inlineCode",{parentName:"p"},"linkid")," of ",Object(i.b)("inlineCode",{parentName:"p"},"Patient/ID")," and this item is mapped to a constant, then the ",Object(i.b)("inlineCode",{parentName:"p"},"constants")," property will have a property ",Object(i.b)("inlineCode",{parentName:"p"},"Patient/ID")),Object(i.b)("p",null,"Within each property of the ",Object(i.b)("inlineCode",{parentName:"p"},"constants")," resource, one can find the following properties:"),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:null},"property"),Object(i.b)("th",{parentName:"tr",align:null},"description"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"display")),Object(i.b)("td",{parentName:"tr",align:null},"the mapping constant as it is displayed on the front end. If a user specifies that a patientID is always ",Object(i.b)("inlineCode",{parentName:"td"},"123"),", ",Object(i.b)("inlineCode",{parentName:"td"},"123")," will be saved here")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"code")),Object(i.b)("td",{parentName:"tr",align:null},"a code for the mapping constant. This is relevant if the item is a ",Object(i.b)("inlineCode",{parentName:"td"},"choice")," value type, in which case the display value may differ from the code. If user defines (rather than selects) the constant, this will be the same as display.")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"valueType")),Object(i.b)("td",{parentName:"tr",align:null},"the valueType of the Questionnaire item")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"path")),Object(i.b)("td",{parentName:"tr",align:null},"this is the path from the FHIR Questionnaire item for which a constant is being provided")))),Object(i.b)("h3",{id:"logic-definitions"},"logic definitions"),Object(i.b)("p",null,"The logic definitions use the format specified below. For simplification purposes, imagine that we have an array of objects ",Object(i.b)("inlineCode",{parentName:"p"},'[{"quality": "fluffy", "animal": "dog"}, {"quality": "spikey", "animal": "hedgehog"}]'),", and we want to us the value from ",Object(i.b)("inlineCode",{parentName:"p"},"animal")," on the object where ",Object(i.b)("inlineCode",{parentName:"p"},"quality")," equals ",Object(i.b)("inlineCode",{parentName:"p"},"fluffy")," (in this case, this resolves to ",Object(i.b)("inlineCode",{parentName:"p"},"dog"),")."),Object(i.b)("table",null,Object(i.b)("thead",{parentName:"table"},Object(i.b)("tr",{parentName:"thead"},Object(i.b)("th",{parentName:"tr",align:null},"property"),Object(i.b)("th",{parentName:"tr",align:null},"description"))),Object(i.b)("tbody",{parentName:"table"},Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"operator")),Object(i.b)("td",{parentName:"tr",align:null},"the following operators are allowed: ",Object(i.b)("inlineCode",{parentName:"td"},"eq")," (equals), ",Object(i.b)("inlineCode",{parentName:"td"},"gt")," (greater than), ",Object(i.b)("inlineCode",{parentName:"td"},"lt")," (less than). The first value that satisfies a given logic condition is selected")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"logicKey")),Object(i.b)("td",{parentName:"tr",align:null},"the property against which the logic is checked. In the example, this is ",Object(i.b)("inlineCode",{parentName:"td"},"quality"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"logicCondition")),Object(i.b)("td",{parentName:"tr",align:null},"the value the logicKey must satisfy. In the example, this is ",Object(i.b)("inlineCode",{parentName:"td"},"fluffy"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"selectKey")),Object(i.b)("td",{parentName:"tr",align:null},"the property from which value is taken if logic is fulfilled. In the example, this is ",Object(i.b)("inlineCode",{parentName:"td"},"animal"))),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"alias")),Object(i.b)("td",{parentName:"tr",align:null},"A user specified name for this logic definition (used within UI); defaults to fhirPath if not provided")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"fhirPath")),Object(i.b)("td",{parentName:"tr",align:null},"fhirPath definition of logic rule")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"headerPath")),Object(i.b)("td",{parentName:"tr",align:null},"path to the parent property on which this logic rule is applied")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"itemPath")),Object(i.b)("td",{parentName:"tr",align:null},"specifies the path for accessing the item as used in headersStructure")),Object(i.b)("tr",{parentName:"tbody"},Object(i.b)("td",{parentName:"tr",align:null},Object(i.b)("strong",{parentName:"td"},"id")),Object(i.b)("td",{parentName:"tr",align:null},"six-character alphanumeric generated by mAtches for managing logic definitions")))))}c.isMDXComponent=!0},97:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return h}));var n=a(0),r=a.n(n);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function b(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var p=r.a.createContext({}),c=function(e){var t=r.a.useContext(p),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},s=function(e){var t=c(e.components);return r.a.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},m=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,l=e.parentName,p=b(e,["components","mdxType","originalType","parentName"]),s=c(a),m=n,h=s["".concat(l,".").concat(m)]||s[m]||d[m]||i;return a?r.a.createElement(h,o(o({ref:t},p),{},{components:a})):r.a.createElement(h,o({ref:t},p))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,l=new Array(i);l[0]=m;var o={};for(var b in t)hasOwnProperty.call(t,b)&&(o[b]=t[b]);o.originalType=e,o.mdxType="string"==typeof e?e:n,l[1]=o;for(var p=2;p<i;p++)l[p]=a[p];return r.a.createElement.apply(null,l)}return r.a.createElement.apply(null,a)}m.displayName="MDXCreateElement"}}]);