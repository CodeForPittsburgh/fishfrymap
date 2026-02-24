import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faFilter } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import "./Sidebar.css";
import { hasActiveFilters } from "@/domain/filterUtils";
import { uiActions } from "@/store/slices/uiSlice";
import { selectionActions } from "@/store/slices/selectionSlice";

const Sidebar = ({ features }) => {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.ui.sidebarVisible);
  const filters = useSelector((state) => state.filters);
  const selectedFeatureId = useSelector((state) => state.selection.selectedFeatureId);
  const filtersActive = hasActiveFilters(filters);

  const onOpenFilter = () => {
    dispatch(uiActions.setFilterModalOpen(true));
  };

  const onHide = () => {
    dispatch(uiActions.toggleSidebar());
  };

  const onRowClick = (featureId) => {
    dispatch(selectionActions.requestOpenFeature({ id: featureId }));
  };

  const onRowMouseOver = (featureId) => {
    dispatch(selectionActions.setHighlightedFeatureId(featureId));
  };

  const onRowMouseOut = () => {
    dispatch(selectionActions.setHighlightedFeatureId(selectedFeatureId));
  };

  return (
    <div id="sidebar" className={visible ? "sidebar-visible" : "sidebar-hidden"}>
      <div className="sidebar-wrapper">
        <Card id="features" className="h-100 border-0 rounded-0">
          <Card.Header>
            <h3 className="h5 mt-3 d-flex align-items-center justify-content-between">
              <span>Fish Fry Venues <span className="small text-muted">({features.length})</span></span>
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
                variant={filtersActive ? "primary" : "outline-primary"}
                className="w-100"
                id="filterSidebar-btn"
                onClick={onOpenFilter}
              >
                <FontAwesomeIcon icon={faFilter} /> {filtersActive ? "Filtered" : "Filter"}
              </Button>
            </div>
            <div className="sidebar-table mt-3">
              <ListGroup id="feature-list" className="list" variant="flush">
                {features.map((feature) => (
                  <ListGroup.Item
                    as="button"
                    type="button"
                    action
                    className="feature-row d-flex align-items-center gap-2"
                    id={feature.id}
                    key={feature.id}
                    onClick={() => onRowClick(feature.id)}
                    onMouseEnter={() => onRowMouseOver(feature.id)}
                    onMouseLeave={onRowMouseOut}
                  >
                    <img className="feature-icon" width="20" src={feature.properties.icon} alt="marker" />
                    <span className="feature-name flex-grow-1 text-start">{feature.properties.venue_name}</span>
                    <FontAwesomeIcon icon={faChevronRight} className="feature-chevron" />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Card.Body>

        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
