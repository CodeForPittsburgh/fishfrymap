import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { FILTER_FIELD_CONFIG, getFieldLabel } from "@/domain/filterFieldConfig";
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

const FilterModal = ({ show, onHide, filters, onChange }) => {
  const thisYear = new Date().getFullYear();
  const standardFields = FILTER_FIELD_CONFIG.filter((field) => field.key !== "publish");
  const publishField = FILTER_FIELD_CONFIG.find((field) => field.key === "publish");

  return (
    <Modal show={show} onHide={onHide} id="filterModal">
      <Modal.Header closeButton>
        <Modal.Title>Other than fish, these are the things I&apos;m looking for in a Fish Fry:</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          <Col >
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
        </Row>

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
