import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_URL = "https://data.pghfishfry.org/api/fishfries/";
const DEFAULT_FALLBACK_URL = `${import.meta.env.BASE_URL}data/fishfrymap.geojson`;

function withSource(data, source) {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return {
      ...data,
      __source: source
    };
  }

  return data;
}

export async function fetchFishfriesWithFallback(baseQuery, env = {}) {
  const apiUrl = env.VITE_FISHFRY_API_URL || DEFAULT_URL;
  const fallbackUrl = env.VITE_FISHFRY_FALLBACK_URL || DEFAULT_FALLBACK_URL;

  const primaryResult = await baseQuery(apiUrl);
  if (!primaryResult.error) {
    return { data: withSource(primaryResult.data, "primary"), meta: { source: "primary" } };
  }

  const fallbackResult = await baseQuery(fallbackUrl);
  if (fallbackResult.error) {
    return { error: primaryResult.error, meta: { source: "error" } };
  }

  return {
    data: withSource(fallbackResult.data, "fallback"),
    meta: {
      source: "fallback",
      primaryError: primaryResult.error
    }
  };
}

export const fishfryApi = createApi({
  reducerPath: "fishfryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getFishfries: builder.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        return fetchFishfriesWithFallback(baseQuery, import.meta.env);
      }
    })
  })
});

export const { useGetFishfriesQuery } = fishfryApi;
