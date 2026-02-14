import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./TopNav.css";

import SearchBox from "@/features/search/SearchBox";
import { faCircleQuestion, faDatabase, faFilter, faList } from "@/icons/fontAwesome";
import { uiActions } from "@/store/slices/uiSlice";

const TopNav = ({ fishSuggestions, placeSuggestions, isSearching }) => {
  const dispatch = useDispatch();
  const navbarExpanded = useSelector((state) => state.ui.navbarExpanded);
  const fishfryYear = import.meta.env.VITE_FISHFRY_YEAR?.trim();
  const desktopTitle = fishfryYear ? `${fishfryYear} Pittsburgh Lenten Fish Fry Map ` : "Pittsburgh Lenten Fish Fry Map";
  const mobileTitle = fishfryYear ? `${fishfryYear} Fish Fry Map ` : "Fish Fry Map";

  const onNavbarToggle = (nextExpanded) => {
    dispatch(uiActions.setNavbarExpanded(Boolean(nextExpanded)));
  };

  const onToggleSidebar = () => {
    dispatch(uiActions.toggleSidebar());
    dispatch(uiActions.setNavbarExpanded(false));
  };

  const onOpenAbout = () => {
    dispatch(uiActions.setAboutModalOpen(true));
    dispatch(uiActions.setNavbarExpanded(false));
  };

  const onOpenFilterModal = () => {
    dispatch(uiActions.setFilterModalOpen(true));
    dispatch(uiActions.setNavbarExpanded(false));
  };

  return (
    <Navbar
      fixed="top"
      expand="md"
      collapseOnSelect
      expanded={navbarExpanded}
      onToggle={onNavbarToggle}
      className="fishfry-navbar"
    >
      <Container fluid>
        <Navbar.Brand className="text-primary fw-bold fs-4 d-none d-md-block">{desktopTitle}</Navbar.Brand>
        <Navbar.Brand className="text-primary fw-bold fs-6 d-md-none">{mobileTitle}</Navbar.Brand>
        <Navbar.Toggle id="nav-btn" aria-controls="fishfry-navbar-nav" />
        <Navbar.Collapse id="fishfry-navbar-nav">
          <Nav className="ms-auto me-3">
            <Nav.Item className="mx-1">
              <Nav.Link as="button" type="button" id="list-btn" onClick={onToggleSidebar} >
                <FontAwesomeIcon icon={faList} className="white" />&nbsp;Venues
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-1">
              <Nav.Link
                as="button"
                type="button"
                id="filterNav-btn"
                onClick={onOpenFilterModal}
                className="text-white"
              >
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;Filter
              </Nav.Link>
            </Nav.Item>            
            <Nav.Item className="mx-1">
              <Nav.Link as="button" type="button" id="about-btn" onClick={onOpenAbout}>
                <FontAwesomeIcon icon={faCircleQuestion} className="white" />&nbsp;&nbsp;About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mx-1">
              <Nav.Link
                href="https://data.wprdc.org/dataset/pittsburgh-fish-fry-map"
                target="_blank"
                rel="noreferrer"
                id="data-btn"

              >
                <FontAwesomeIcon icon={faDatabase} />&nbsp;Data
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form className="fishfry-search-form d-none d-md-block" role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchBox fishSuggestions={fishSuggestions} placeSuggestions={placeSuggestions} isSearching={isSearching} />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
