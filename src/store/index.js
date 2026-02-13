import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "@/store/slices/uiSlice";
import filtersReducer from "@/store/slices/filtersSlice";
import selectionReducer from "@/store/slices/selectionSlice";
import mapReducer from "@/store/slices/mapSlice";
import searchReducer from "@/store/slices/searchSlice";
import { fishfryApi } from "@/store/api/fishfryApi";
import { geocodeApi } from "@/store/api/geocodeApi";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    filters: filtersReducer,
    selection: selectionReducer,
    map: mapReducer,
    search: searchReducer,
    [fishfryApi.reducerPath]: fishfryApi.reducer,
    [geocodeApi.reducerPath]: geocodeApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fishfryApi.middleware, geocodeApi.middleware)
});
