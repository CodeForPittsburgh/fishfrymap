import { describe, expect, it } from "vitest";

import {
  attrClean,
  boolValue,
  FILTER_KEYS,
  getLatLng,
  iconLookup,
  matchesSearch,
  normalizeFeature,
  normalizeFeatureCollection,
  normalizeUrl,
  resolveIcon
} from "../../../src/domain/featureUtils";

describe("featureUtils", () => {
  it("normalizes URLs", () => {
    expect(normalizeUrl("http://x.com")).toBe("http://x.com");
    expect(normalizeUrl("https://x.com")).toBe("https://x.com");
    expect(normalizeUrl("x.com")).toBe("http://x.com");
    expect(normalizeUrl("")).toBe("");
    expect(normalizeUrl(null)).toBe("");
  });

  it("resolves icon based on publish and venue type", () => {
    expect(resolveIcon({ properties: { publish: false } })).toBe(iconLookup.unpublished);
    expect(resolveIcon({ properties: { publish: true, venue_type: "Church" } })).toBe(iconLookup.Church);
    expect(resolveIcon({ properties: { publish: true, venue_type: "UnknownType" } })).toBe(iconLookup[""]);
  });

  it("normalizes feature shape and derived fields", () => {
    const raw = {
      id: 101,
      properties: {
        publish: true,
        venue_type: "Church",
        website: "example.com",
        menu: {
          url: "menu.example.com",
          text: null
        }
      },
      geometry: {
        type: "Point",
        coordinates: [-79.99, 40.44]
      }
    };

    const normalized = normalizeFeature(raw);
    expect(normalized.id).toBe("101");
    expect(normalized.properties.website).toBe("http://example.com");
    expect(normalized.properties.menu.url).toBe("http://menu.example.com");
    expect(normalized.properties.menu.text).toBe("");
    expect(normalized.properties.icon).toBe(iconLookup.Church);
  });

  it("normalizes feature collections", () => {
    expect(normalizeFeatureCollection({ features: [] })).toEqual([]);
    expect(normalizeFeatureCollection(null)).toEqual([]);

    const normalized = normalizeFeatureCollection({
      features: [
        {
          properties: { publish: false },
          geometry: { type: "Point", coordinates: [0, 0] }
        }
      ]
    });

    expect(normalized.length).toBe(1);
    expect(normalized[0].id).toBe("0");
  });

  it("supports search helpers and booleans", () => {
    const feature = {
      properties: {
        venue_name: "St. Example",
        venue_address: "123 Main St",
        etc: "Drive thru available"
      }
    };

    expect(matchesSearch(feature, "example")).toBe(true);
    expect(matchesSearch(feature, "main")).toBe(true);
    expect(matchesSearch(feature, "drive")).toBe(true);
    expect(matchesSearch(feature, "zzzz")).toBe(false);
    expect(matchesSearch(feature, "")).toBe(false);

    expect(boolValue(true)).toBe(true);
    expect(boolValue("Yes")).toBe(true);
    expect(boolValue(1)).toBe(true);
    expect(boolValue(false)).toBe(false);

    expect(attrClean(null)).toBe("");
    expect(attrClean("abc")).toBe("abc");
  });

  it("provides coordinate extraction and filter keys", () => {
    expect(getLatLng({ geometry: { coordinates: [-79.99, 40.44] } })).toEqual({
      lat: 40.44,
      lng: -79.99
    });

    expect(FILTER_KEYS).toEqual([
      "drive_thru",
      "lunch",
      "homemade_pierogies",
      "alcohol",
      "take_out",
      "handicap",
      "GoodFriday",
      "publish"
    ]);
  });
});
