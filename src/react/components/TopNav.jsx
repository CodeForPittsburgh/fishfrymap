import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchBox from "./SearchBox";
import { faBars, faCircleQuestion, faDatabase, faFilter } from "../icons/fontAwesome";

const TopNav = ({
  navbarExpanded,
  onToggleNavbar,
  onToggleSidebar,
  onOpenAbout,
  onOpenFilterModal,
  searchProps
}) => {
  return (
    <div className="navbar navbar-default navbar-fixed-top" role="navigation">
      <div className="container-fluid">
        <div className="navbar-header">
          <div className="navbar-icon-container">
            <a href="#" className="navbar-icon pull-right visible-xs" id="nav-btn" onClick={onToggleNavbar}>
              <FontAwesomeIcon icon={faBars} size="lg" className="white" />
            </a>
            <a
              href="#"
              className="navbar-icon pull-right visible-xs"
              id="sidebar-toggle-btn"
              onClick={onToggleSidebar}
            >
              <FontAwesomeIcon icon={faFilter} size="lg" className="white" />
            </a>
          </div>
          <span className="navbar-brand hidden-xs hidden-sm">Pittsburgh Lenten Fish Fry Map</span>
          <span className="navbar-brand hidden-md hidden-lg small">Fish Fry Map</span>
        </div>
        <div className={`navbar-collapse collapse ${navbarExpanded ? "in" : ""}`}>
          <form className="navbar-form navbar-right" role="search" onSubmit={(event) => event.preventDefault()}>
            <SearchBox {...searchProps} />
          </form>
          <ul className="nav navbar-nav navbar-right">
            <li className="hidden-xs">
              <a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="list-btn" onClick={onToggleSidebar}>
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;&nbsp;Filter
              </a>
            </li>
            <li>
              <a href="#" data-toggle="collapse" data-target=".navbar-collapse.in" id="about-btn" onClick={onOpenAbout}>
                <FontAwesomeIcon icon={faCircleQuestion} className="white" />&nbsp;&nbsp;About
              </a>
            </li>
            <li>
              <a
                href="https://data.wprdc.org/dataset/pittsburgh-fish-fry-map"
                target="_blank"
                rel="noreferrer"
                data-toggle="collapse"
                data-target=".navbar-collapse.in"
                id="data-btn"
              >
                <FontAwesomeIcon icon={faDatabase} />&nbsp;&nbsp;Data
              </a>
            </li>
            <li className="visible-xs">
              <a href="#" id="filterNav-btn" onClick={onOpenFilterModal}>
                <FontAwesomeIcon icon={faFilter} className="white" />&nbsp;&nbsp;Filter options
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
