import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const MAPBOX_BASE_URL = "https://api.mapbox.com/geocoding/v5/mapbox.places";

export async function queryMapboxSuggestions(baseQuery, searchTerm, env = {}) {
  const token = env.VITE_MAPBOX_TOKEN;
  const query = (searchTerm || "").trim();

  if (!token || query.length < 3) {
    return { data: [] };
  }

  const encoded = encodeURIComponent(query);
  const url = `${MAPBOX_BASE_URL}/${encoded}.json`;
  const result = await baseQuery({
    url,
    params: {
      access_token: token,
      country: "us",
      proximity: "-79.9976593,40.4396267",
      autocomplete: true,
      limit: 5
    }
  });

  if (result.error) {
    return { error: result.error };
  }

  const features = Array.isArray(result.data?.features) ? result.data.features : [];
  return {
    data: features.map((feature) => ({
      source: "Mapbox",
      name: feature.place_name,
      lat: feature.geometry?.coordinates?.[1],
      lng: feature.geometry?.coordinates?.[0]
    }))
  };
}

export const geocodeApi = createApi({
  reducerPath: "geocodeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    searchPlaces: builder.query({
      async queryFn(searchTerm, _api, _extraOptions, baseQuery) {
        return queryMapboxSuggestions(baseQuery, searchTerm, import.meta.env);
      }
    })
  })
});

export const { useSearchPlacesQuery } = geocodeApi;
