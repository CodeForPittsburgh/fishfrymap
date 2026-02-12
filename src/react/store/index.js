import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./slices/uiSlice";
import filtersReducer from "./slices/filtersSlice";
import selectionReducer from "./slices/selectionSlice";
import mapReducer from "./slices/mapSlice";
import searchReducer from "./slices/searchSlice";
import { fishfryApi } from "./api/fishfryApi";
import { geocodeApi } from "./api/geocodeApi";

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
