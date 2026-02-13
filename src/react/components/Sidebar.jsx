import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faFilter } from "../icons/fontAwesome";

const Sidebar = ({
  visible,
  features,
  hasActiveFilters,
  onOpenFilter,
  onHide,
  onRowClick,
  onRowMouseOver,
  onRowMouseOut
}) => {
  return (
    <div id="sidebar" style={{ display: visible ? "block" : "none" }}>
      <div className="sidebar-wrapper">
        <div className="panel panel-default" id="features">
          <div className="panel-heading">
            <h3 className="panel-title">
              Fish Fry Filter
              <button type="button" className="btn btn-xs btn-default pull-right" id="sidebar-hide-btn" onClick={onHide}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </h3>
          </div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-12">
                <a
                  className={`btn btn-block btn-sm ${hasActiveFilters ? "btn-primary" : "btn-default"}`}
                  id="filterSidebar-btn"
                  href="#"
                  role="button"
                  onClick={onOpenFilter}
                >
                  <FontAwesomeIcon icon={faFilter} /> {hasActiveFilters ? "Filtered" : "Filter"}
                </a>
              </div>
            </div>
          </div>
          <div className="sidebar-table">
            <table className="table table-hover table-condensed" id="feature-list">
              <thead className="hidden">
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Chevron</th>
                </tr>
              </thead>
              <tbody className="list">
                {features.map((feature) => (
                  <tr
                    className="feature-row"
                    id={feature.id}
                    key={feature.id}
                    onClick={() => onRowClick(feature.id)}
                    onMouseOver={() => onRowMouseOver(feature.id)}
                    onMouseOut={onRowMouseOut}
                  >
                    <td style={{ verticalAlign: "middle" }}>
                      <img width="20" src={feature.properties.icon} alt="marker" />
                    </td>
                    <td className="feature-name">{feature.properties.venue_name}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      <FontAwesomeIcon icon={faChevronRight} className="pull-right" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
