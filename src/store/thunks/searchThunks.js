import { mapActions } from "@/store/slices/mapSlice";
import { searchActions } from "@/store/slices/searchSlice";
import { selectionActions } from "@/store/slices/selectionSlice";
import { uiActions } from "@/store/slices/uiSlice";

export const handleSuggestionSelected = (suggestion) => (dispatch) => {
  if (!suggestion) {
    return;
  }

  if (suggestion.source === "FishFrys") {
    dispatch(mapActions.setOverlayVisible(true));
    dispatch(selectionActions.requestOpenFeature({ id: suggestion.id }));
  } else {
    dispatch(
      selectionActions.requestSetView({
        lat: suggestion.lat,
        lng: suggestion.lng,
        zoom: 17
      })
    );
  }

  dispatch(searchActions.setSuggestionsOpen(false));
  dispatch(uiActions.setNavbarExpanded(false));
};
