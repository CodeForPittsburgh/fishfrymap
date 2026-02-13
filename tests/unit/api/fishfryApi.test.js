import { describe, expect, it, vi } from "vitest";

import { fetchFishfriesWithFallback } from "../../../src/react/store/api/fishfryApi";

describe("fishfryApi fallback behavior", () => {
  it("returns primary data when primary API succeeds", async () => {
    const baseQuery = vi.fn().mockResolvedValueOnce({
      data: { type: "FeatureCollection", features: [] }
    });

    const result = await fetchFishfriesWithFallback(baseQuery, {
      VITE_FISHFRY_API_URL: "https://primary.example/api/fishfries/",
      VITE_FISHFRY_FALLBACK_URL: "/data/fishfrymap.geojson"
    });

    expect(baseQuery).toHaveBeenCalledTimes(1);
    expect(baseQuery).toHaveBeenCalledWith("https://primary.example/api/fishfries/");
    expect(result.error).toBeUndefined();
    expect(result.data.__source).toBe("primary");
  });

  it("falls back to local data when primary API errors", async () => {
    const baseQuery = vi
      .fn()
      .mockResolvedValueOnce({ error: { status: 500, data: "boom" } })
      .mockResolvedValueOnce({
        data: { type: "FeatureCollection", features: [{ id: "1" }] }
      });

    const result = await fetchFishfriesWithFallback(baseQuery, {
      VITE_FISHFRY_API_URL: "https://primary.example/api/fishfries/",
      VITE_FISHFRY_FALLBACK_URL: "/data/fishfrymap.geojson"
    });

    expect(baseQuery).toHaveBeenCalledTimes(2);
    expect(baseQuery).toHaveBeenNthCalledWith(2, "/data/fishfrymap.geojson");
    expect(result.error).toBeUndefined();
    expect(result.data.__source).toBe("fallback");
    expect(result.data.features.length).toBe(1);
  });

  it("returns error when both primary and fallback fail", async () => {
    const primaryError = { status: 503, data: "unavailable" };
    const baseQuery = vi
      .fn()
      .mockResolvedValueOnce({ error: primaryError })
      .mockResolvedValueOnce({ error: { status: 404, data: "missing" } });

    const result = await fetchFishfriesWithFallback(baseQuery, {
      VITE_FISHFRY_API_URL: "https://primary.example/api/fishfries/",
      VITE_FISHFRY_FALLBACK_URL: "/data/fishfrymap.geojson"
    });

    expect(baseQuery).toHaveBeenCalledTimes(2);
    expect(result.data).toBeUndefined();
    expect(result.error).toEqual(primaryError);
  });
});

