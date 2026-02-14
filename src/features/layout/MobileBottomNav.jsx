import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import SearchBox from "@/features/search/SearchBox";
import { faFilter, faList, faLocationArrow } from "@/icons/fontAwesome";
import { uiActions } from "@/store/slices/uiSlice";
import "./MobileBottomNav.css";

const MobileBottomNav = ({ fishSuggestions, placeSuggestions, isSearching }) => {
  const dispatch = useDispatch();
  const sidebarVisible = useSelector((state) => state.ui.sidebarVisible);
  const visibilityClassName = sidebarVisible ? "d-none d-md-none" : "d-flex d-md-none";
  const onToggleSidebar = () => {
    dispatch(uiActions.toggleSidebar());
    dispatch(uiActions.setNavbarExpanded(false));
  };

  return (
    <Navbar fixed="bottom" id="mobile-footer" className={`mobile-bottom-nav ${visibilityClassName}`}>
      <Container fluid className="mobile-bottom-nav__content px-2 py-2 gap-2 align-items-center">
        <div className="mobile-bottom-nav__actions d-flex gap-1">
          <Button
            type="button"
            id="mobile-venues-btn"
            variant="outline-light"
            className="mobile-bottom-nav__button"
            onClick={onToggleSidebar}
            aria-label="Venues list"
            title="Venues list"
          >
            <FontAwesomeIcon icon={faList} />
            <span className="mobile-bottom-nav__button-label d-none d-sm-inline">Venues</span>
          </Button>

          <Button
            type="button"
            id="mobile-filter-btn"
            variant="outline-light"
            className="mobile-bottom-nav__button"
            onClick={() => dispatch(uiActions.setFilterModalOpen(true))}
            aria-label="Filter"
            title="Filter"
          >
            <FontAwesomeIcon icon={faFilter} />
            <span className="mobile-bottom-nav__button-label d-none d-sm-inline">Filter</span>
          </Button>
        </div>

        <div className="mobile-bottom-nav__search">
          <SearchBox
            fishSuggestions={fishSuggestions}
            placeSuggestions={placeSuggestions}
            isSearching={isSearching}
            menuPlacement="up"
            inputId="mobile-searchbox"
          />
        </div>

        {/* TODO: Near-Me functionality */}
        {/* <Button
          type="button"
          id="mobile-nearby-btn"
          variant="outline-light"
          className="mobile-bottom-nav__button"
          aria-label="Near Me"
          title="Near Me"
          disabled
        >
          <FontAwesomeIcon icon={faLocationArrow} />
          <span className="mobile-bottom-nav__button-label d-none d-sm-inline">Near Me</span>
        </Button> */}
      </Container>
    </Navbar>
  );
};

export default MobileBottomNav;
