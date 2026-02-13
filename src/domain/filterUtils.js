export function filterFeature(feature, filters) {
  let noFiltersApplied = true;
  const results = [];

  Object.entries(filters).forEach(([key, checked]) => {
    if (checked) {
      noFiltersApplied = false;
    }

    if (!checked) {
      return;
    }

    const propValue = feature?.properties?.[key];

    results.push(checked === propValue);
  });

  if (noFiltersApplied) {
    return true;
  }

  return !results.includes(false);
}

export function filterFeatures(features, filters) {
  return features.filter((feature) => filterFeature(feature, filters));
}

export function hasActiveFilters(filters) {
  return Object.values(filters).some(Boolean);
}

export function featureIsInBounds(feature, bounds) {
  if (!bounds) {
    return true;
  }

  const [lng, lat] = feature?.geometry?.coordinates || [];
  if (typeof lat !== "number" || typeof lng !== "number") {
    return false;
  }

  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng <= bounds.east &&
    lng >= bounds.west
  );
}
