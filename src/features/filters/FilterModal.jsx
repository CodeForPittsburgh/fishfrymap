import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, ListGroup, Modal, Row } from "react-bootstrap";
import { faBagShopping, faBeerMugEmpty, faClock, faUtensils, faWheelchair, faPlus } from "@/icons/fontAwesome";
import "./FilterModal.css";

const FILTER_FIELDS = [
  { key: "drive_thru", label: "Drive-Thru Available" },
  {
    key: "lunch",
    label: (
      <>
        Open for Lunch <FontAwesomeIcon icon={faUtensils} aria-hidden="true" />{" "}
        <FontAwesomeIcon icon={faClock} aria-hidden="true" />
      </>
    )
  },
  { key: "homemade_pierogies", label: "Homemade Pierogies !!!" },
  {
    key: "alcohol",
    label: (
      <>
        Serves Alcohol <FontAwesomeIcon icon={faBeerMugEmpty} aria-hidden="true" />
      </>
    )
  },
  {
    key: "take_out",
    label: (
      <>
        Takeout Available <FontAwesomeIcon icon={faBagShopping} aria-hidden="true" />
      </>
    )
  },
  {
    key: "handicap",
    label: (
      <>
        Handicap Accessible <FontAwesomeIcon icon={faWheelchair} aria-hidden="true" />
      </>
    )
  },
  {
    key: "AshWednesday",
    label: (
      <>
        Open Ash Wednesday <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      </>
    )
  },  
  {
    key: "GoodFriday",
    label: (
      <>
        Open Good Friday <FontAwesomeIcon icon={faPlus} aria-hidden="true" />
      </>
    )
  },
];

const FilterModal = ({ show, onHide, filters, onChange }) => {
  const thisYear = new Date().getFullYear();

  return (
    <Modal show={show} onHide={onHide} id="filterModal">
      <Modal.Header closeButton>
        <Modal.Title>Other than fish, these are the things I&apos;m looking for in a Fish Fry:</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Row>
          <Col >
            <ListGroup className="filter-field-list mb-3">
              {FILTER_FIELDS.map((filter) => {
                const isChecked = Boolean(filters[filter.key]);

                return (
                  <ListGroup.Item
                    as="label"
                    action
                    className={`filter-field-item ${isChecked ? "is-checked" : ""}`}
                    htmlFor={filter.key}
                    key={filter.key}
                  >
                    <Form.Check.Input
                      className="filter-field-checkbox"
                      id={filter.key}
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => onChange(filter.key, event.target.checked)}
                    />
                    <span className="filter-field-item-label">{filter.label}</span>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <ListGroup className="publish-filter-list my-2">
              <ListGroup.Item
                as="label"
                action
                className={`filter-field-item ${Boolean(filters.publish) ? "is-checked" : ""}`}
                htmlFor="publish"
              >
                <Form.Check.Input
                  className="filter-field-checkbox"
                  id="publish"
                  type="checkbox"
                  checked={Boolean(filters.publish)}
                  onChange={(event) => onChange("publish", event.target.checked)}
                />
                <span className="filter-field-item-label">Show only those verified for {thisYear}.</span>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
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
