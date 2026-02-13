import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import { faBagShopping, faBeerMugEmpty, faClock, faUtensils, faWheelchair } from "../icons/fontAwesome";

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
      <Modal.Body>
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            {FILTER_FIELDS.map((filter) => (
              <div className="checkbox" key={filter.key}>
                <h4>
                  <label>
                    <input
                      className="filter"
                      id={filter.key}
                      type="checkbox"
                      checked={Boolean(filters[filter.key])}
                      onChange={(event) => onChange(filter.key, event.target.checked)}
                    />
                    {" "}
                    {filter.label}
                  </label>
                </h4>
                <hr />
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2 bg-info">
            <div className="checkbox">
              <label>
                <input
                  className="filter"
                  id="publish"
                  type="checkbox"
                  checked={Boolean(filters.publish)}
                  onChange={(event) => onChange("publish", event.target.checked)}
                />
                {" "}
                Show only those verified for {thisYear}.
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8 col-sm-offset-2">
            <h4>
              <small>
                Note that while we try our best to verify all details about Fish Fries, some details may be
                incomplete. Please check with the Fish Fry venue ahead of time and rely on the above filters at your
                own discretion.
              </small>
            </h4>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="btn btn-default" onClick={onHide}>
          Find those Fish Fries!
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
