import { createSlice } from "@reduxjs/toolkit";
import { FILTER_KEYS } from "../../domain/featureUtils";

const initialFilters = FILTER_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {});

const filtersSlice = createSlice({
  name: "filters",
  initialState: initialFilters,
  reducers: {
    setFilter(state, action) {
      const { key, value } = action.payload;
      if (!(key in state)) {
        return;
      }

      state[key] = Boolean(value);
    },
    setAllFilters(_state, action) {
      return {
        ...initialFilters,
        ...action.payload
      };
    },
    resetFilters() {
      return { ...initialFilters };
    }
  }
});

export const filtersActions = filtersSlice.actions;
export default filtersSlice.reducer;
