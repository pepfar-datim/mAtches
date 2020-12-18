function compareItems(officialItem, toCompareItem) {
  //if item is array
  if (typeof officialItem == "object") {
    if (Array.isArray(officialItem)) {
      if (officialItem.length != toCompareItem.length) {
        return false;
      }
      for (let i = 0; i < officialItem.length; i++) {
        return compareItems(officialItem[i], toCompareItem[i]);
      }
    } else {
      return compareObjects(
        JSON.parse(JSON.stringify(officialItem)),
        JSON.parse(JSON.stringify(toCompareItem))
      );
    }
  } else {
    if (officialItem == toCompareItem) {
      return true;
    }
  }
}

function compareObjects(officialObject, toCompareObject) {
  var isSame = true;
  for (const key in officialObject) {
    //if property is missing, mark maps as different
    if (!toCompareObject.hasOwnProperty(key)) {
      return false;
    }

    //if property type is different, mark maps as different
    if (typeof officialObject[key] != typeof toCompareObject[key]) {
      return false;
    }

    if (!compareItems(officialObject[key], toCompareObject[key])) {
      return false;
    }
    delete toCompareObject[key];
  }

  // if toCompareObject has additional properties, comparison fails
  if (Object.keys(toCompareObject).length > 0) {
    return false;
  }

  return isSame;
}

export default compareObjects;
