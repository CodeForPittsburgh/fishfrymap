import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
  suggestionsOpen: false
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery(state, action) {
      state.query = action.payload ?? "";
    },
    setSuggestionsOpen(state, action) {
      state.suggestionsOpen = Boolean(action.payload);
    },
    clearSearch(state) {
      state.query = "";
      state.suggestionsOpen = false;
    }
  }
});

export const searchActions = searchSlice.actions;
export default searchSlice.reducer;
