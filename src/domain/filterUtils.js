import { isOpenOnGoodFriday } from "@/domain/dateUtils";

export function filterFeature(feature, filters, goodFridayDate) {
  let noFiltersApplied = true;
  const results = [];

  Object.entries(filters).forEach(([key, checked]) => {
    if (checked) {
      noFiltersApplied = false;
    }

    if (!checked) {
      return;
    }

    let propValue = false;
    if (key === "GoodFriday") {
      propValue = isOpenOnGoodFriday(feature?.properties?.events, goodFridayDate);
    } else {
      propValue = feature?.properties?.[key];
    }

    results.push(checked === propValue);
  });

  if (noFiltersApplied) {
    return true;
  }

  return !results.includes(false);
}

export function filterFeatures(features, filters, goodFridayDate) {
  return features.filter((feature) => filterFeature(feature, filters, goodFridayDate));
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
