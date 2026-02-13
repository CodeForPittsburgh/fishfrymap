import React, { useEffect, useMemo } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import TopNav from "./components/TopNav";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import AboutModal from "./components/AboutModal";
import FilterModal from "./components/FilterModal";
import FeatureModal from "./components/FeatureModal";
import LoadingOverlay from "./components/LoadingOverlay";
import ModalErrorBoundary from "./components/ModalErrorBoundary";

import { useGetFishfriesQuery } from "./store/api/fishfryApi";
import { useSearchPlacesQuery } from "./store/api/geocodeApi";
import { uiActions } from "./store/slices/uiSlice";
import { filtersActions } from "./store/slices/filtersSlice";
import { mapActions } from "./store/slices/mapSlice";
import { searchActions } from "./store/slices/searchSlice";
import { selectionActions } from "./store/slices/selectionSlice";

import { computeGoodFriday } from "./domain/dateUtils";
import { normalizeFeatureCollection, matchesSearch } from "./domain/featureUtils";
import { featureIsInBounds, filterFeatures, hasActiveFilters } from "./domain/filterUtils";

const App = () => {
  const dispatch = useDispatch();
  const hasMapboxToken = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

  const ui = useSelector((state) => state.ui);
  const filters = useSelector((state) => state.filters);
  const mapState = useSelector((state) => state.map);
  const searchState = useSelector((state) => state.search);
  const selection = useSelector((state) => state.selection);

  const { data, isLoading, isFetching, error } = useGetFishfriesQuery();
  const dataSource = data?.__source || "primary";

  const searchQuery = searchState.query;
  const goodFridayDate = useMemo(() => computeGoodFriday(moment().year()), []);

  const allFeatures = useMemo(() => {
    return normalizeFeatureCollection(data).sort((left, right) => {
      return (left.properties.venue_name || "").localeCompare(right.properties.venue_name || "");
    });
  }, [data]);

  const featuresById = useMemo(() => {
    const map = new Map();
    allFeatures.forEach((feature) => {
      map.set(feature.id, feature);
    });
    return map;
  }, [allFeatures]);

  const filteredFeatures = useMemo(() => {
    return filterFeatures(allFeatures, filters, goodFridayDate);
  }, [allFeatures, filters, goodFridayDate]);

  const visibleFeatures = useMemo(() => {
    if (!mapState.overlayVisible) {
      return [];
    }

    return filteredFeatures.filter((feature) => featureIsInBounds(feature, mapState.bounds));
  }, [filteredFeatures, mapState.bounds, mapState.overlayVisible]);

  const fishSuggestions = useMemo(() => {
    if (searchQuery.trim().length < 3) {
      return [];
    }

    return allFeatures
      .filter((feature) => matchesSearch(feature, searchQuery))
      .slice(0, 10)
      .map((feature) => ({
        source: "FishFrys",
        id: feature.id,
        name: feature.properties.venue_name,
        address: feature.properties.venue_address,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
      }));
  }, [allFeatures, searchQuery]);

  const { data: placeSuggestions = [], isFetching: isGeocoding } = useSearchPlacesQuery(searchQuery, {
    skip: searchQuery.trim().length < 3
  });

  const selectedFeature = selection.selectedFeatureId
    ? featuresById.get(selection.selectedFeatureId) || null
    : null;

  useEffect(() => {
    if (document.body.clientWidth <= 767) {
      dispatch(uiActions.setSidebarVisible(false));
    }
  }, [dispatch]);

  const onFeatureClick = ({ featureId }) => {
    dispatch(selectionActions.setSelectedFeatureId(featureId));
    dispatch(selectionActions.setHighlightedFeatureId(featureId));
    dispatch(uiActions.setFeatureModalOpen(true));
  };

  const onMoveEnd = ({ bounds, center, zoom }) => {
    dispatch(
      mapActions.setMapViewState({
        bounds,
        center: {
          lat: center.lat,
          lng: center.lng
        },
        zoom
      })
    );
  };

  const onOverlayChange = ({ visible }) => {
    dispatch(mapActions.setOverlayVisible(visible));
  };

  const onBasemapChange = ({ id }) => {
    dispatch(mapActions.setActiveBasemap(id));
  };

  const onMapClick = () => {
    dispatch(selectionActions.setHighlightedFeatureId(null));
  };

  const onSelectSuggestion = (suggestion) => {
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

  return (
    <>
      <TopNav
        navbarExpanded={ui.navbarExpanded}
        onToggleNavbar={(event) => {
          event.preventDefault();
          dispatch(uiActions.setNavbarExpanded(!ui.navbarExpanded));
        }}
        onToggleSidebar={(event) => {
          event.preventDefault();
          dispatch(uiActions.toggleSidebar());
          dispatch(uiActions.setNavbarExpanded(false));
        }}
        onOpenAbout={(event) => {
          event.preventDefault();
          dispatch(uiActions.setAboutModalOpen(true));
          dispatch(uiActions.setNavbarExpanded(false));
        }}
        onOpenFilterModal={(event) => {
          event.preventDefault();
          dispatch(uiActions.setFilterModalOpen(true));
          dispatch(uiActions.setNavbarExpanded(false));
        }}
        searchProps={{
          query: searchQuery,
          onQueryChange: (value) => dispatch(searchActions.setQuery(value)),
          suggestionsOpen: searchState.suggestionsOpen,
          onSuggestionsOpen: (open) => dispatch(searchActions.setSuggestionsOpen(open)),
          fishSuggestions,
          placeSuggestions,
          onSelectSuggestion,
          isSearching: isGeocoding
        }}
      />

      <div id="container" style={{ marginTop: "10px", paddingBottom: "10px" }}>
        <Sidebar
          visible={ui.sidebarVisible}
          features={visibleFeatures}
          hasActiveFilters={hasActiveFilters(filters)}
          onOpenFilter={(event) => {
            event.preventDefault();
            dispatch(uiActions.setFilterModalOpen(true));
          }}
          onHide={() => dispatch(uiActions.toggleSidebar())}
          onRowClick={(featureId) => {
            dispatch(selectionActions.requestOpenFeature({ id: featureId }));
          }}
          onRowMouseOver={(featureId) => {
            dispatch(selectionActions.setHighlightedFeatureId(featureId));
          }}
          onRowMouseOut={() => {
            dispatch(selectionActions.setHighlightedFeatureId(selection.selectedFeatureId));
          }}
        />

        <MapView
          features={allFeatures}
          filteredFeatures={filteredFeatures}
          overlayVisible={mapState.overlayVisible}
          activeBasemap={mapState.activeBasemap}
          highlightedFeatureId={selection.highlightedFeatureId}
          openFeatureRequest={selection.openFeatureRequest}
          focusFeatureRequest={selection.focusFeatureRequest}
          setViewRequest={selection.setViewRequest}
          sidebarVisible={ui.sidebarVisible}
          onMoveEnd={onMoveEnd}
          onOverlayChange={onOverlayChange}
          onBasemapChange={onBasemapChange}
          onFeatureClick={onFeatureClick}
          onMapClick={onMapClick}
          onOpenHandled={() => dispatch(selectionActions.acknowledgeOpenFeature())}
          onFocusHandled={() => dispatch(selectionActions.acknowledgeFocusFeature())}
          onSetViewHandled={() => dispatch(selectionActions.acknowledgeSetView())}
        />
      </div>

      <LoadingOverlay show={isLoading || isFetching} />

      <ModalErrorBoundary name="about" label="About dialog" resetKey={`about-${ui.aboutModalOpen}`}>
        <AboutModal
          show={ui.aboutModalOpen}
          onHide={() => {
            dispatch(uiActions.setAboutModalOpen(false));
          }}
        />
      </ModalErrorBoundary>

      <ModalErrorBoundary name="filter" label="Filter dialog" resetKey={`filter-${ui.filterModalOpen}`}>
        <FilterModal
          show={ui.filterModalOpen}
          onHide={() => {
            dispatch(uiActions.setFilterModalOpen(false));
          }}
          filters={filters}
          onChange={(key, value) => {
            dispatch(filtersActions.setFilter({ key, value }));
          }}
        />
      </ModalErrorBoundary>

      <ModalErrorBoundary
        name="feature"
        label="Feature details dialog"
        resetKey={`feature-${ui.featureModalOpen}-${selection.selectedFeatureId || "none"}`}
      >
        <FeatureModal
          show={ui.featureModalOpen}
          onHide={() => {
            dispatch(uiActions.setFeatureModalOpen(false));
            dispatch(selectionActions.setHighlightedFeatureId(null));
          }}
          feature={selectedFeature}
          goodFridayDate={goodFridayDate}
          currentYear={moment().year()}
        />
      </ModalErrorBoundary>

      {error ? (
        <div className="fishfry-error alert alert-warning" role="alert">
          Unable to load data from the primary API and fallback source.
        </div>
      ) : null}

      {!error && dataSource === "fallback" ? (
        <div className="fishfry-error alert alert-info" role="alert" style={{ bottom: "64px" }}>
          Primary API is unreachable; showing fallback data.
        </div>
      ) : null}

      {!hasMapboxToken && searchQuery.trim().length >= 3 ? (
        <div
          className="fishfry-error alert alert-info"
          role="alert"
          style={{ bottom: dataSource === "fallback" ? "116px" : "64px" }}
        >
          Mapbox geocoding is disabled because <code>VITE_MAPBOX_TOKEN</code> is not set.
        </div>
      ) : null}
    </>
  );
};

export default App;
