import { describe, expect, it } from "vitest";

import { computeGoodFriday } from "../../../src/react/domain/dateUtils";
import {
  featureIsInBounds,
  filterFeature,
  filterFeatures,
  hasActiveFilters
} from "../../../src/react/domain/filterUtils";

const baseFeature = {
  properties: {
    publish: true,
    drive_thru: true,
    lunch: false,
    homemade_pierogies: true,
    alcohol: false,
    take_out: true,
    handicap: true,
    events: [{ dt_start: "2026-04-03T12:00:00", dt_end: "2026-04-03T14:00:00" }]
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
  publish: false
};

describe("filterUtils", () => {
  it("returns true when no filters are active", () => {
    const goodFriday = computeGoodFriday(2026);
    expect(filterFeature(baseFeature, allOff, goodFriday)).toBe(true);
  });

  it("matches direct property filters", () => {
    const goodFriday = computeGoodFriday(2026);

    expect(
      filterFeature(
        baseFeature,
        {
          ...allOff,
          publish: true,
          drive_thru: true
        },
        goodFriday
      )
    ).toBe(true);

    expect(
      filterFeature(
        baseFeature,
        {
          ...allOff,
          lunch: true
        },
        goodFriday
      )
    ).toBe(false);
  });

  it("uses GoodFriday computed filter", () => {
    const goodFriday = computeGoodFriday(2026);

    expect(filterFeature(baseFeature, { ...allOff, GoodFriday: true }, goodFriday)).toBe(true);
    expect(
      filterFeature(
        {
          ...baseFeature,
          properties: {
            ...baseFeature.properties,
            events: []
          }
        },
        { ...allOff, GoodFriday: true },
        goodFriday
      )
    ).toBe(false);
  });

  it("filters collections and detects active filters", () => {
    const goodFriday = computeGoodFriday(2026);
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

    const filtered = filterFeatures(features, { ...allOff, publish: true }, goodFriday);
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
