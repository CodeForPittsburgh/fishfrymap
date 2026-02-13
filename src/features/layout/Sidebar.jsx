import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faFilter } from "@/icons/fontAwesome";
import { Button, Card, Table } from "react-bootstrap";

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
        <Card id="features" className="h-100 border-0 rounded-0">
          <Card.Header>
            <h3 className="h5 mt-3 d-flex align-items-center justify-content-between">
              <span>Fish Fry Filter</span>
              <Button
                type="button"
                variant="primary"
                size="sm"
                id="sidebar-hide-btn"
                onClick={onHide}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
            </h3>
          </Card.Header>
          <Card.Body className="px-0">
            <div className="mx-2">
            <Button
              type="button"
              size="sm"
              variant={hasActiveFilters ? "primary" : "outline-primary"}
              className="w-100"
              id="filterSidebar-btn"
              onClick={onOpenFilter}
            >
              <FontAwesomeIcon icon={faFilter} /> {hasActiveFilters ? "Filtered" : "Filter"}
            </Button>
            </div>
          <div className="sidebar-table mt-3">
            <Table hover size="sm" id="feature-list">
              <thead className="visually-hidden">
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
                      <FontAwesomeIcon icon={faChevronRight} className="float-end" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>            
          </Card.Body>

        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
