import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./TopNav.css";

import SearchBox from "@/features/search/SearchBox";
import { faBars, faCircleQuestion, faDatabase, faFilter } from "@/icons/fontAwesome";
import { uiActions } from "@/store/slices/uiSlice";

const TopNav = ({ fishSuggestions, placeSuggestions, isSearching }) => {
  const dispatch = useDispatch();
  const navbarExpanded = useSelector((state) => state.ui.navbarExpanded);

  const onToggleNavbar = () => {
    dispatch(uiActions.setNavbarExpanded(!navbarExpanded));
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
    <Navbar fixed="top" expand="md" expanded={navbarExpanded} className="fishfry-navbar">
      <Container fluid>
        <div className="d-flex align-items-center gap-2 d-md-none">
          <Button
            type="button"
            variant="link"
            className="fishfry-navbar-icon"
            id="sidebar-toggle-btn"
            onClick={onToggleSidebar}
          >
            <FontAwesomeIcon icon={faFilter} size="lg" className="white" />
          </Button>
          <Button
            type="button"
            variant="link"
            className="fishfry-navbar-icon"
            id="nav-btn"
            onClick={onToggleNavbar}
          >
            <FontAwesomeIcon icon={faBars} size="lg" className="white" />
          </Button>
        </div>

        <Navbar.Brand className="text-white fw-bold fs-4 d-none d-md-block">
          Pittsburgh Lenten Fish Fry Map
        </Navbar.Brand>
        <Navbar.Brand className="text-white fw-bold fs-6 d-md-none">Fish Fry Map</Navbar.Brand>

        <Navbar.Collapse>

          <Nav className="ms-auto">
            <Nav.Item className="d-none d-md-block">
              <Nav.Link as="button" type="button" id="list-btn" onClick={onToggleSidebar} >
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;&nbsp;Filter
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="button" type="button" id="about-btn" onClick={onOpenAbout}>
                <FontAwesomeIcon icon={faCircleQuestion} className="white" />&nbsp;&nbsp;About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="https://data.wprdc.org/dataset/pittsburgh-fish-fry-map"
                target="_blank"
                rel="noreferrer"
                id="data-btn"

              >
                <FontAwesomeIcon icon={faDatabase} />&nbsp;&nbsp;Data
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="d-md-none">
              <Nav.Link
                as="button"
                type="button"
                id="filterNav-btn"
                onClick={onOpenFilterModal}
                className="text-white"
              >
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;&nbsp;Filter options
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Form className="fishfry-search-form" role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchBox fishSuggestions={fishSuggestions} placeSuggestions={placeSuggestions} isSearching={isSearching} />
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
