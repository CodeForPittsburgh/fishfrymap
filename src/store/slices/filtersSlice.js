import { createSlice } from "@reduxjs/toolkit";
import { FILTER_KEYS } from "@/domain/filterFieldConfig";
import { isCanonicalVenueType } from "@/domain/venueTypeConfig";

const initialBooleanFilters = FILTER_KEYS.reduce((acc, key) => {
  acc[key] = key === "publish";
  return acc;
}, {});

const initialFilters = {
  ...initialBooleanFilters,
  venueTypes: []
};

function normalizeVenueTypes(values) {
  if (!Array.isArray(values)) {
    return [];
  }

  return [...new Set(values.filter((value) => isCanonicalVenueType(value)))];
}

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      if (!(key in initialBooleanFilters)) {
        return;
      }

      state[key] = Boolean(value);
    },
    toggleVenueType(state, action) {
      const venueType = action.payload;
      if (!isCanonicalVenueType(venueType)) {
        return;
      }

      const exists = state.venueTypes.includes(venueType);
      state.venueTypes = exists
        ? state.venueTypes.filter((value) => value !== venueType)
        : [...state.venueTypes, venueType];
    },
    setVenueTypes(state, action) {
      state.venueTypes = normalizeVenueTypes(action.payload);
    },
    setAllFilters(_state, action) {
      return {
        ...initialFilters,
        ...action.payload,
        venueTypes: normalizeVenueTypes(action.payload?.venueTypes)
      };
    },
    resetFilters() {
      return { ...initialFilters };
    }
  }
});

export const filtersActions = filtersSlice.actions;
export default filtersSlice.reducer;
