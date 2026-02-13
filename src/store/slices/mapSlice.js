import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  center: {
    lat: 40.4452,
    lng: -79.9866
  },
  zoom: 10,
  bounds: null,
  overlayVisible: true,
  activeBasemap: "light"
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapViewState(state, action) {
      const { center, zoom, bounds } = action.payload || {};
      if (center) {
        state.center = center;
      }
      if (typeof zoom === "number") {
        state.zoom = zoom;
      }
      if (bounds) {
        state.bounds = bounds;
      }
    },
    setOverlayVisible(state, action) {
      state.overlayVisible = Boolean(action.payload);
    },
    setActiveBasemap(state, action) {
      state.activeBasemap = action.payload || state.activeBasemap;
    }
  }
});

export const mapActions = mapSlice.actions;
export default mapSlice.reducer;
