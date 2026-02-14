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

export function getFeatureBounds(features) {
  if (!Array.isArray(features) || features.length === 0) {
    return null;
  }

  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;
  let hasValidCoordinate = false;

  features.forEach((feature) => {
    const [lng, lat] = feature?.geometry?.coordinates || [];
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    hasValidCoordinate = true;
    north = Math.max(north, lat);
    south = Math.min(south, lat);
    east = Math.max(east, lng);
    west = Math.min(west, lng);
  });

  if (!hasValidCoordinate) {
    return null;
  }

  return {
    north,
    south,
    east,
    west
  };
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
