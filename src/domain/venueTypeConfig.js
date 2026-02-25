export const VENUE_TYPE_OPTIONS = [
  { value: "church", label: "Church" },
  { value: "fire_department", label: "Fire Department" },
  { value: "restaurant", label: "Restaurant" },
  { value: "community_organization", label: "Community Organization" },
  { value: "food_truck", label: "Food Truck" },
  { value: "other_unsure", label: "Other / Unsure" }
];

const RAW_TO_CANONICAL = {
  church: "church",
  "fire department": "fire_department",
  restaurant: "restaurant",
  resturant: "restaurant",
  restuarant: "restaurant",
  "community organization": "community_organization",
  "food truck": "food_truck",
  "unsure / n/a": "other_unsure",
  market: "other_unsure",
  veterans: "other_unsure",
  other: "other_unsure",
  "": "other_unsure"
};

const CANONICAL_VENUE_TYPE_SET = new Set(VENUE_TYPE_OPTIONS.map((option) => option.value));

export function isCanonicalVenueType(value) {
  return CANONICAL_VENUE_TYPE_SET.has(value);
}

export function canonicalizeVenueType(rawVenueType) {
  const normalized = typeof rawVenueType === "string" ? rawVenueType.trim().toLowerCase() : "";
  return RAW_TO_CANONICAL[normalized] || "other_unsure";
}
