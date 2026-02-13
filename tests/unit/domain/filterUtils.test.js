import { describe, expect, it } from "vitest";

import {
  featureIsInBounds,
  filterFeature,
  filterFeatures,
  hasActiveFilters
} from "../../../src/domain/filterUtils";

const baseFeature = {
  properties: {
    publish: true,
    drive_thru: true,
    lunch: false,
    homemade_pierogies: true,
    alcohol: false,
    take_out: true,
    handicap: true,
    GoodFriday: true,
    AshWednesday: false
  },
  geometry: {
    coordinates: [-79.99, 40.44]
  }
};

const allOff = {
  drive_thru: false,
  lunch: false,
  homemade_pierogies: false,
  alcohol: false,
  take_out: false,
  handicap: false,
  GoodFriday: false,
  AshWednesday: false,
  publish: false
};

describe("filterUtils", () => {
  it("returns true when no filters are active", () => {
    expect(filterFeature(baseFeature, allOff)).toBe(true);
  });

  it("matches direct property filters", () => {
    expect(
      filterFeature(
        baseFeature,
        {
          ...allOff,
          publish: true,
          drive_thru: true
        }
      )
    ).toBe(true);

    expect(
      filterFeature(
        baseFeature,
        {
          ...allOff,
          lunch: true
        }
      )
    ).toBe(false);
  });

  it("matches liturgical day filters from feature properties", () => {
    expect(filterFeature(baseFeature, { ...allOff, GoodFriday: true })).toBe(true);
    expect(filterFeature(baseFeature, { ...allOff, AshWednesday: true })).toBe(false);
    expect(
      filterFeature(
        {
          ...baseFeature,
          properties: {
            ...baseFeature.properties,
            GoodFriday: false,
            AshWednesday: true
          }
        },
        { ...allOff, GoodFriday: true }
      )
    ).toBe(false);
    expect(
      filterFeature(
        {
          ...baseFeature,
          properties: {
            ...baseFeature.properties,
            GoodFriday: false,
            AshWednesday: true
          }
        },
        { ...allOff, AshWednesday: true }
      )
    ).toBe(true);
  });

  it("filters collections and detects active filters", () => {
    const features = [
      baseFeature,
      {
        ...baseFeature,
        properties: {
          ...baseFeature.properties,
          publish: false
        }
      }
    ];

    const filtered = filterFeatures(features, { ...allOff, publish: true });
    expect(filtered.length).toBe(1);
    expect(hasActiveFilters(allOff)).toBe(false);
    expect(hasActiveFilters({ ...allOff, publish: true })).toBe(true);
  });

  it("checks geographic bounds correctly", () => {
    expect(featureIsInBounds(baseFeature, null)).toBe(true);

    const inBounds = {
      north: 41,
      south: 40,
      east: -79,
      west: -80
    };

    const outBounds = {
      north: 40.2,
      south: 39,
      east: -79,
      west: -80
    };

    expect(featureIsInBounds(baseFeature, inBounds)).toBe(true);
    expect(featureIsInBounds(baseFeature, outBounds)).toBe(false);
    expect(featureIsInBounds({ geometry: { coordinates: [] } }, inBounds)).toBe(false);
  });
});
