var themeColors = {
    "error": "lightSalmon",
	"highlightColor": "orange",
	"primary": "lightSteelBlue",
	"primaryDark": "steelBlue",
    "secondaryLight": "whiteSmoke",
    "secondary": "lightGrey",
    "secondaryDark": "darkGrey",
    "success": "darkSeaGreen",
	"white": "white",
}

var themeSettings = {
	"spacing": 10,
	"midWidth": 20,
	"smallMargin": "5px",
	"width": "200px"
}

var stylesObj = {
    "addBox": {
      "backgroundColor": themeColors.primary
    },
    "addHeaderText": {
    	"width": "160px",
    },
    "editCard": {
        "position": "relative",
        "backgroundColor": themeColors.secondary,
        "height": "100%",
        "minHeight": "750px"
    },
    "editCardSelector": {
        "minWidth": "160px",
        "paddingTop": themeSettings.spacing + "px"
    },
    "editCardSelectorButton": {
        "textTransform": "none", 
        "marginTop": themeSettings.spacing + "px",
        "backgroundColor": themeColors.secondaryLight
    },
    "editCardSelectorButtonIcon": {
        "margin": themeSettings.spacing / 2 + "px"
    },
    "editCardSelectorPadding": {
        "paddingBottom": themeSettings.spacing * 4 + "px"
    },
    "editCardUploadButtonDisabled": {
        "position": "absolute", 
        "right": "0px", 
        "bottom": "0px", 
        "margin": "20px", 
        "backgroundColor": themeColors.secondaryDark
    },
    "editCardUploadButtonEnabled": {
        "position": "absolute", 
        "right": "0px", 
        "bottom": "0px", 
        "margin": "20px", 
        "backgroundColor": themeColors.success
    },    
    "gridWidth": {
    	"maxWidth": "300px"
    },
    "headerBar": {
        "background": themeColors.secondaryLight,
        "color": "black"
    },
    "headerBarRightIcons": {
        "position": "absolute",
        "right": "0px"
    },
    "hidden": {
    	"visibility": "hidden"
    },
    "mainCard": {
        "backgroundColor": "lightGrey",
        "height": "100%",
        "minHeight": "750px"        
    },
    "mappingBoxBanner": {
    	"backgroundColor": themeColors.primaryDark,
    },
    "marginQuarter": {
        "margin": themeSettings.spacing / 2 + "px"
    },    
    "marginQuarterBottom": {
        "marginBottom": themeSettings.spacing / 2 + "px"
    },
    "minWidth": {
    	"minWidth": themeSettings.midWidth
	},
    "themePadding": {
    	"padding": themeSettings.spacing * 2 + "px"
    },
    "themePaddingBottom": {
        "paddingBottom": themeSettings.spacing * 2 + "px"
    },    
    "themePaddingHalf": {
        "padding": themeSettings.spacing + "px"
    },
    "themePaddingQuarter": {
        "padding": themeSettings.spacing / 2 + "px"
    },        
    "themeWidth" : {
    	"width": themeSettings.width
    },
    "flexGrow": {
        "flexGrow": 1
    },
    "sideCard": {
        "backgroundColor": themeColors.primary,
        "height": "100%"
    },    
    "smallMargin": {
    	"margin": "5px"
    },
    "tabIndicator": {
    	"backgroundColor": themeColors.highlightColor,
    	"textColor": themeColors.highlightColor
    },
    "uploadDestinationRadioGroup": {
        "padding": themeSettings.spacing / 2 + "px",
        "marginLeft": themeSettings.spacing + "px"
    },
    "uploadDestinationRadio": {
        "color": "black"
    },
    "uploadDestinationText": {
        "width": "600px", 
        "marginBottom": themeSettings.spacing * 2 + "px"
    },        
    "validationErrorProp": {
        "paddingLeft": themeSettings.spacing + "px",
        "paddingTop": themeSettings.spacing * 2 + "px"
    },
    "validationErrorText": {
        "paddingLeft": themeSettings.spacing * 2 + "px",
        "paddingTop": themeSettings.spacing / 2 + "px"
    },
    "validationErrorCard": {
        "backgroundColor": themeColors.error,
        "width": "100%"
    },
    "validationSuccessCard": {
        "backgroundColor": themeColors.success,
        "width": "100%"
    },
    "validationWarningCard": {
        "backgroundColor": "lightYellow", 
        "width": "100%", 
        "marginBottom": themeSettings.spacing + "px"
    },
    "valueMapCard" : {
        "position": "relative", 
        "backgroundColor": themeColors.secondaryLight,
        "height": "100%",
        "minHeight": "750px"
    },
    "valueMapButton": {
        "textTransform": "none",
        "marginTop": themeSettings.spacing * 2 + "px",
        "marginBottom": themeSettings.spacing * 2 + "px", 
        "backgroundColor": themeColors.primary
    },
    "valueMapContinueButton": {
        "position": "absolute",
        "right": "0px", 
        "bottom": "0px", 
        "margin": themeSettings.spacing * 2 + "px", 
        "backgroundColor": themeColors.secondary
    },
    "valueMapUploadButton": {
        "backgroundColor": themeColors.primary
    },
    "valueMapUploadStepLabel": {
        "root": 
            {"color": themeColors.primary}
    },
    "whiteBackground": {
    	"backgroundColor": themeColors.white
    }
}

export {themeColors, themeSettings, stylesObj}