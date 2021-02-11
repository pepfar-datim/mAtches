function compareItems(officialItem, toCompareItem) {
  // if item is array
  if (typeof officialItem === "object") {
    if (Array.isArray(officialItem)) {
      if (officialItem.length !== toCompareItem.length) {
        return false;
      }
      for (let i = 0; i < officialItem.length; i += 1) {
        return compareItems(officialItem[i], toCompareItem[i]);
      }
    } else {
      return compareObjects(
        JSON.parse(JSON.stringify(officialItem)),
        JSON.parse(JSON.stringify(toCompareItem))
      );
    }
  } else if (officialItem === toCompareItem) {
    return true;
  }
  return false;
}

function compareObjects(officialObject, toCompareObject) {
  const isSame = true;

  Object.keys(officialObject).forEach((key) => {
    // if property is missing, mark maps as different
    if (!Object.prototype.hasOwnProperty.call(toCompareObject, key)) {
      return false;
    }

    // if property type is different, mark maps as different
    if (typeof officialObject[key] !== typeof toCompareObject[key]) {
      return false;
    }

    if (!compareItems(officialObject[key], toCompareObject[key])) {
      return false;
    }
    delete toCompareObject[key];
    return false;
  });

  // if toCompareObject has additional properties, comparison fails
  if (Object.keys(toCompareObject).length > 0) {
    return false;
  }

  return isSame;
}

export default compareObjects;
