import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { FILTER_FIELD_CONFIG, getFieldLabel } from "@/domain/filterFieldConfig";
import { VENUE_TYPE_OPTIONS } from "@/domain/venueTypeConfig";
import { getFilterFieldIcon } from "@/icons/filterFieldIcons";
import "./FilterModal.css";

function renderFilterFieldLabel(field, year) {
  const label = getFieldLabel(field, { year });

  if (!field.filterIconKeys.length) {
    return label;
  }

  return (
    <div className="ps-2">
      {field.filterIconKeys.map((iconKey) => {
        const icon = getFilterFieldIcon(iconKey);
        if (!icon) {
          return null;
        }

        return (
          <React.Fragment key={`${field.key}-${iconKey}`}>
            <FontAwesomeIcon icon={icon} aria-hidden="true" />
            {" "}
          </React.Fragment>
        );
      })}
      <span className="ps-2">{label}</span>
    </div>
  );
}

const FilterModal = ({ show, onHide, filters, onChange, onVenueTypeToggle }) => {
  const thisYear = new Date().getFullYear();
  const standardFields = FILTER_FIELD_CONFIG.filter((field) => field.key !== "publish");
  const publishField = FILTER_FIELD_CONFIG.find((field) => field.key === "publish");
  const selectedVenueTypes = Array.isArray(filters?.venueTypes) ? filters.venueTypes : [];

  return (
    <Modal show={show} onHide={onHide} id="filterModal" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Other than fish, these are the things I&apos;m looking for in a Fish Fry:</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          <Col xs={12} md={6}>
            <p className="fs-5">Fish Fry Features</p>
            <ListGroup className="filter-field-list mb-3">
              {standardFields.map((field) => {
                const label = renderFilterFieldLabel(field, thisYear);
                const isChecked = Boolean(filters[field.key]);

                return (
                  <ListGroup.Item
                    as="label"
                    action
                    className={`py-3 filter-field-item ${isChecked ? "is-checked" : ""}`}
                    htmlFor={field.key}
                    key={field.key}
                  >
                    <Form.Check.Input
                      className="filter-field-checkbox"
                      id={field.key}
                      type="checkbox"
                      checked={isChecked}
                      size='xl'
                      onChange={(event) => onChange(field.key, event.target.checked)}
                    />
                    <span className="filter-field-item-label">{label}</span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col xs={12} md={6}>
            <p className="fs-5">Type of Venue</p>
            <ListGroup className="venue-type-filter-list mb-3">
              {VENUE_TYPE_OPTIONS.map((option) => {
                const inputId = `venue-type-${option.value}`;
                const isChecked = selectedVenueTypes.includes(option.value);

                return (
                  <ListGroup.Item
                    as="label"
                    action
                    className={`py-3 filter-field-item ${isChecked ? "is-checked" : ""}`}
                    htmlFor={inputId}
                    key={option.value}
                  >
                    <Form.Check.Input
                      className="filter-field-checkbox"
                      id={inputId}
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onVenueTypeToggle?.(option.value)}
                    />
                    <span className="filter-field-item-label">{option.label}</span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
        {/* <p className="small text-muted text-center"><em>Filters are selected, all types will be shown</em></p> */}

        {publishField ? (
          <Row>
            <Col>
              <ListGroup className="publish-filter-list my-2">
                <ListGroup.Item
                  as="label"
                  action
                  className={`filter-field-item ${Boolean(filters[publishField.key]) ? "is-checked" : ""}`}
                  htmlFor={publishField.key}
                >
                  <Form.Check.Input
                    className="filter-field-checkbox"
                    id={publishField.key}
                    type="checkbox"
                    checked={Boolean(filters[publishField.key])}
                    onChange={(event) => onChange(publishField.key, event.target.checked)}
                  />
                  <span className="filter-field-item-label">{renderFilterFieldLabel(publishField, thisYear)}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        ) : null}

        <Row>
          <Col >
            <p>
              Note that while we try our best to verify all details about Fish Fries, some details may be
              incomplete. Please check with the Fish Fry venue ahead of time and rely on the above filters at your
              own discretion.
            </p>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onHide}>
          Find those Fish Fries!
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
