import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  aboutModalOpen: false,
  filterModalOpen: false,
  featureModalOpen: false,
  sidebarVisible: true,
  navbarExpanded: false
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAboutModalOpen(state, action) {
      state.aboutModalOpen = Boolean(action.payload);
    },
    setFilterModalOpen(state, action) {
      state.filterModalOpen = Boolean(action.payload);
    },
    setFeatureModalOpen(state, action) {
      state.featureModalOpen = Boolean(action.payload);
    },
    setSidebarVisible(state, action) {
      state.sidebarVisible = Boolean(action.payload);
    },
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
    setNavbarExpanded(state, action) {
      state.navbarExpanded = Boolean(action.payload);
    }
  }
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
