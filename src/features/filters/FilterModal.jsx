import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { faBagShopping, faBeerMugEmpty, faClock, faUtensils, faWheelchair } from "@/icons/fontAwesome";

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
    key: "GoodFriday",
    label: (
      <>
        Open Good Friday <FontAwesomeIcon icon={faBagShopping} aria-hidden="true" />
      </>
    )
  }
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
            {FILTER_FIELDS.map((filter) => (
              <Form.Group className="mb-3" key={filter.key}>
                <h4>
                  <Form.Check
                    className="filter"
                    inline
                    id={filter.key}
                    type="checkbox"
                    checked={Boolean(filters[filter.key])}
                    onChange={(event) => onChange(filter.key, event.target.checked)}
                    label={filter.label}
                  />
                </h4>
                <hr />
              </Form.Group>
            ))}
          </Col>
        </Row>
        
        <Row>
          <Col className="bg-primary rounded py-2 my-2">
            <Form.Check
              className="filter"
              id="publish"
              type="checkbox"
              checked={Boolean(filters.publish)}
              onChange={(event) => onChange("publish", event.target.checked)}
              label={`Show only those verified for ${thisYear}.`}
            />
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
