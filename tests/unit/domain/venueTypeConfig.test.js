import { describe, expect, it } from "vitest";

import {
  VENUE_TYPE_OPTIONS,
  canonicalizeVenueType,
  isCanonicalVenueType
} from "../../../src/domain/venueTypeConfig";

describe("venueTypeConfig", () => {
  it("exposes canonical venue type options", () => {
    expect(VENUE_TYPE_OPTIONS.map((option) => option.value)).toEqual([
      "church",
      "fire_department",
      "restaurant",
      "community_organization",
      "food_truck",
      "other_unsure"
    ]);
  });

  it("canonicalizes known venue types and misspellings", () => {
    expect(canonicalizeVenueType("Church")).toBe("church");
    expect(canonicalizeVenueType("Fire Department")).toBe("fire_department");
    expect(canonicalizeVenueType("Restaurant")).toBe("restaurant");
    expect(canonicalizeVenueType("Resturant")).toBe("restaurant");
    expect(canonicalizeVenueType("Restuarant")).toBe("restaurant");
    expect(canonicalizeVenueType("Community Organization")).toBe("community_organization");
    expect(canonicalizeVenueType("Food Truck")).toBe("food_truck");
  });

  it("maps unknown and long-tail types to other_unsure", () => {
    expect(canonicalizeVenueType("Market")).toBe("other_unsure");
    expect(canonicalizeVenueType("Veterans")).toBe("other_unsure");
    expect(canonicalizeVenueType("Other")).toBe("other_unsure");
    expect(canonicalizeVenueType("Unsure / N/A")).toBe("other_unsure");
    expect(canonicalizeVenueType("")).toBe("other_unsure");
    expect(canonicalizeVenueType(null)).toBe("other_unsure");
    expect(canonicalizeVenueType("Made Up Type")).toBe("other_unsure");
  });

  it("validates canonical venue type values", () => {
    expect(isCanonicalVenueType("church")).toBe(true);
    expect(isCanonicalVenueType("other_unsure")).toBe(true);
    expect(isCanonicalVenueType("market")).toBe(false);
    expect(isCanonicalVenueType("")).toBe(false);
  });
});
