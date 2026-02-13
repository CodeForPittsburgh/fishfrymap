import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";

import SearchBox from "@/features/search/SearchBox";
import { faBars, faCircleQuestion, faDatabase, faFilter } from "@/icons/fontAwesome";

const TopNav = ({
  navbarExpanded,
  onToggleNavbar,
  onToggleSidebar,
  onOpenAbout,
  onOpenFilterModal,
  searchProps
}) => {
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
          <Form className="ms-auto fishfry-search-form" role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchBox {...searchProps} />
          </Form>
          <Nav className="ms-md-3">
            <Nav.Item className="d-none d-md-block">
              <Nav.Link as="button" type="button" id="list-btn" onClick={onToggleSidebar} className="text-white">
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;&nbsp;Filter
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as="button" type="button" id="about-btn" onClick={onOpenAbout} className="text-white">
                <FontAwesomeIcon icon={faCircleQuestion} className="white" />&nbsp;&nbsp;About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="https://data.wprdc.org/dataset/pittsburgh-fish-fry-map"
                target="_blank"
                rel="noreferrer"
                id="data-btn"
                className="text-white"
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
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNav;
