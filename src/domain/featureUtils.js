import { deriveLiturgicalOpenFlags } from "@/domain/dateUtils";
export { FILTER_KEYS } from "@/domain/filterFieldConfig";

const iconPath = `${import.meta.env.BASE_URL}assets/img/`;

export const iconLookup = {
  Church: `${iconPath}Church.png`,
  "Community Organization": `${iconPath}Community_Organization.png`,
  "Food Truck": `${iconPath}Food_Truck.png`,
  "Fire Department": `${iconPath}Fire_Department.png`,
  Restaurant: `${iconPath}Restaurant.png`,
  "Unsure / N/A": `${iconPath}Unsure_NA.png`,
  "": `${iconPath}Unsure_NA.png`,
  unpublished: `${iconPath}yellowpoint75.png`
};

export function attrClean(value) {
  return value || "";
}

export function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return "";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `http://${url}`;
}

export function resolveIcon(feature) {
  const properties = feature?.properties || {};

  if (!properties.publish) {
    return iconLookup.unpublished;
  }

  const venueType = properties.venue_type || "";
  return iconLookup[venueType] || iconLookup[""];
}

export function normalizeFeature(rawFeature, index = 0) {
  const properties = rawFeature?.properties || {};
  const liturgicalFlags = deriveLiturgicalOpenFlags(properties.events);
  const geometry = rawFeature?.geometry || {};
  const coordinates = geometry?.coordinates || [];

  const feature = {
    ...rawFeature,
    id: `${rawFeature?.id ?? index}`,
    properties: {
      ...properties,
      GoodFriday: liturgicalFlags.GoodFriday,
      AshWednesday: liturgicalFlags.AshWednesday,
      website: normalizeUrl(properties.website),
      menu: {
        text: properties?.menu?.text || "",
        url: normalizeUrl(properties?.menu?.url)
      }
    },
    geometry: {
      ...geometry,
      coordinates
    }
  };

  feature.properties.icon = resolveIcon(feature);

  return feature;
}

export function normalizeFeatureCollection(data) {
  const features = Array.isArray(data?.features) ? data.features : [];
  return features.map((feature, index) => normalizeFeature(feature, index));
}

export function getLatLng(feature) {
  const [lng, lat] = feature?.geometry?.coordinates || [];
  return {
    lat,
    lng
  };
}

export function matchesSearch(feature, searchTerm) {
  const term = searchTerm.trim().toLowerCase();
  if (!term) {
    return false;
  }

  const name = (feature?.properties?.venue_name || "").toLowerCase();
  const address = (feature?.properties?.venue_address || "").toLowerCase();
  const notes = (feature?.properties?.etc || "").toLowerCase();

  return name.includes(term) || address.includes(term) || notes.includes(term);
}

export function boolValue(value) {
  return value === true || ["true", "True", 1, "Yes", "yes"].includes(value);
}
