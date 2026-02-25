import { canonicalizeVenueType } from "@/domain/venueTypeConfig";

export function filterFeature(feature, filters) {
  const venueTypes = Array.isArray(filters?.venueTypes) ? filters.venueTypes : [];
  let noBooleanFiltersApplied = true;
  const booleanResults = [];

  Object.entries(filters || {}).forEach(([key, checked]) => {
    if (key === "venueTypes") {
      return;
    }

    const isChecked = Boolean(checked);
    if (isChecked) {
      noBooleanFiltersApplied = false;
    }

    if (!isChecked) {
      return;
    }

    const propValue = feature?.properties?.[key];

    booleanResults.push(isChecked === propValue);
  });

  const passBooleanFilters = noBooleanFiltersApplied || !booleanResults.includes(false);
  const featureVenueType =
    feature?.properties?.venue_type_canonical || canonicalizeVenueType(feature?.properties?.venue_type);
  const passVenueTypeFilters = venueTypes.length === 0 || venueTypes.includes(featureVenueType);

  return passBooleanFilters && passVenueTypeFilters;
}

export function filterFeatures(features, filters) {
  return features.filter((feature) => filterFeature(feature, filters));
}

export function hasActiveFilters(filters) {
  const venueTypeFilters = Array.isArray(filters?.venueTypes) ? filters.venueTypes : [];
  if (venueTypeFilters.length > 0) {
    return true;
  }

  return Object.entries(filters || {}).some(([key, value]) => key !== "venueTypes" && Boolean(value));
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
