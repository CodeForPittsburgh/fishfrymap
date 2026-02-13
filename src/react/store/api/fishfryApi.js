import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const DEFAULT_URL = "https://data.pghfishfry.org/api/fishfries/";
const DEFAULT_FALLBACK_URL = "/data/fishfrymap.geojson";

export const fishfryApi = createApi({
  reducerPath: "fishfryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "" }),
  endpoints: (builder) => ({
    getFishfries: builder.query({
      async queryFn(_arg, _api, _extraOptions, baseQuery) {
        const apiUrl = import.meta.env.VITE_FISHFRY_API_URL || DEFAULT_URL;
        const fallbackUrl = import.meta.env.VITE_FISHFRY_FALLBACK_URL || DEFAULT_FALLBACK_URL;

        const primaryResult = await baseQuery(apiUrl);
        if (!primaryResult.error) {
          return { data: primaryResult.data };
        }

        const fallbackResult = await baseQuery(fallbackUrl);
        if (fallbackResult.error) {
          return { error: primaryResult.error };
        }

        return { data: fallbackResult.data };
      }
    })
  })
});

export const { useGetFishfriesQuery } = fishfryApi;
