import { describe, expect, it, vi } from "vitest";

import { queryMapboxSuggestions } from "../../../src/store/api/geocodeApi";

describe("geocodeApi token and query behavior", () => {
  it("returns empty suggestions when token is missing", async () => {
    const baseQuery = vi.fn();
    const result = await queryMapboxSuggestions(baseQuery, "pizza", {
      VITE_MAPBOX_TOKEN: ""
    });

    expect(baseQuery).not.toHaveBeenCalled();
    expect(result).toEqual({ data: [] });
  });

  it("returns empty suggestions when query is shorter than 3 characters", async () => {
    const baseQuery = vi.fn();
    const result = await queryMapboxSuggestions(baseQuery, "pi", {
      VITE_MAPBOX_TOKEN: "token"
    });

    expect(baseQuery).not.toHaveBeenCalled();
    expect(result).toEqual({ data: [] });
  });

  it("maps mapbox features into SearchSuggestion objects", async () => {
    const baseQuery = vi.fn().mockResolvedValueOnce({
      data: {
        features: [
          {
            place_name: "Downtown, Pittsburgh, Pennsylvania",
            geometry: { coordinates: [-79.9959, 40.4406] }
          }
        ]
      }
    });

    const result = await queryMapboxSuggestions(baseQuery, "downtown", {
      VITE_MAPBOX_TOKEN: "token"
    });

    expect(baseQuery).toHaveBeenCalledTimes(1);
    expect(result.error).toBeUndefined();
    expect(result.data).toEqual([
      {
        source: "Mapbox",
        name: "Downtown, Pittsburgh, Pennsylvania",
        lat: 40.4406,
        lng: -79.9959
      }
    ]);
  });

  it("returns query errors from mapbox requests", async () => {
    const error = { status: 401, data: "unauthorized" };
    const baseQuery = vi.fn().mockResolvedValueOnce({ error });

    const result = await queryMapboxSuggestions(baseQuery, "downtown", {
      VITE_MAPBOX_TOKEN: "bad-token"
    });

    expect(baseQuery).toHaveBeenCalledTimes(1);
    expect(result.error).toEqual(error);
  });
});

