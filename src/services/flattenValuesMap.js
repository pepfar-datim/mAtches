function flattenValuesMap(tempValueSet) {
  const modified = tempValueSet.flatMap((k) =>
    k.maps.length > 0 ? k.maps.flatMap((m) => [[k.code, m]]) : [[k.code, ""]]
  );
  modified.unshift(["Target", "Source"]);
  return modified;
}

export default flattenValuesMap;
