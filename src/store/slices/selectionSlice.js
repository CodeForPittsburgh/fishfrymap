import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedFeatureId: null,
  highlightedFeatureId: null,
  openFeatureRequest: null,
  focusFeatureRequest: null,
  setViewRequest: null,
  requestSeq: 0
};

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    setSelectedFeatureId(state, action) {
      state.selectedFeatureId = action.payload ?? null;
    },
    setHighlightedFeatureId(state, action) {
      state.highlightedFeatureId = action.payload ?? null;
    },
    requestOpenFeature(state, action) {
      state.requestSeq += 1;
      state.openFeatureRequest = {
        seq: state.requestSeq,
        id: action.payload?.id ?? null
      };
    },
    acknowledgeOpenFeature(state) {
      state.openFeatureRequest = null;
    },
    requestFocusFeature(state, action) {
      state.requestSeq += 1;
      state.focusFeatureRequest = {
        seq: state.requestSeq,
        id: action.payload?.id ?? null,
        zoom: action.payload?.zoom
      };
    },
    acknowledgeFocusFeature(state) {
      state.focusFeatureRequest = null;
    },
    requestSetView(state, action) {
      state.requestSeq += 1;
      state.setViewRequest = {
        seq: state.requestSeq,
        lat: action.payload?.lat,
        lng: action.payload?.lng,
        zoom: action.payload?.zoom
      };
    },
    acknowledgeSetView(state) {
      state.setViewRequest = null;
    }
  }
});

export const selectionActions = selectionSlice.actions;
export default selectionSlice.reducer;
