import React, { useMemo } from "react";
import moment from "moment";
import { Modal } from "react-bootstrap";

import { attrClean, boolValue } from "../domain/featureUtils";
import { parseDateTimes } from "../domain/dateUtils";

function BooleanPanel({ label, value }) {
  const isTrue = boolValue(value);
  const isFalse = value === false || ["false", "False", 0, "No", "no"].includes(value);

  let icon = <i className="fa fa-question fa-2x" aria-hidden="true" />;
  let text = "Unsure";
  let panelClass = "panel panel-default";

  if (isTrue) {
    icon = <i className="fa fa-check fa-2x" aria-hidden="true" />;
    text = "Yes";
    panelClass = "panel panel-default bool-card-true";
  } else if (isFalse) {
    icon = <i className="fa fa-times fa-2x" aria-hidden="true" />;
    text = "No";
  }

  return (
    <div className={panelClass}>
      <div className="panel-body">
        <p className="text-center">{label}</p>
        <p className="text-center">
          {icon}
          <br />
          <small>{text}</small>
        </p>
      </div>
    </div>
  );
}

const FeatureModal = ({ show, onHide, feature, goodFridayDate, currentYear }) => {
  const events = useMemo(() => {
    if (!feature) {
      return {
        today: [],
        future: [],
        GoodFriday: false
      };
    }

    return parseDateTimes(feature.properties.events, moment(), goodFridayDate);
  }, [feature, goodFridayDate]);

  if (!feature) {
    return null;
  }

  const address = attrClean(feature.properties.venue_address);
  const directionsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(address)}`;

  return (
    <Modal show={show} onHide={onHide} size="lg" id="featureModal">
      <Modal.Header closeButton>
        <div id="feature-info-header">
          <div className="row">
            <div className="col-md-9">
              <h3 className="modal-title">
                <span id="feature-title">{attrClean(feature.properties.venue_name)}</span>
              </h3>
            </div>
            <div className="col-md-3">
              <h3 className="modal-title text-right hidden-sm hidden-xs">
                <small>{attrClean(feature.properties.venue_type)}</small>
              </h3>
              <h3 className="modal-title hidden-md hidden-lg">
                <small>{attrClean(feature.properties.venue_type)}</small>
              </h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-9">
              <h4 className="modal-title">
                <span id="feature-subtitle">{address}</span>&nbsp;
              </h4>
            </div>
            <div className="col-md-3">
              <h4 className="modal-title text-right">
                <small>
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    Get directions &rarr;
                  </a>
                </small>
              </h4>
            </div>
          </div>
        </div>
      </Modal.Header>
      <Modal.Body>
        {!feature.properties.publish ? (
          <div className="alert alert-info" role="alert">
            <h4>
              This Fish Fry has not yet been verified this year. If you have info about this location for {currentYear},
              please head to our <a href="https://www.facebook.com/PittsburghLentenFishFryMap/">Facebook page</a>.
            </h4>
          </div>
        ) : null}

        {feature.properties.procedures ? (
          <div className="alert alert-info" role="alert">
            <h4>A Note About Operations with COVID-19</h4>
            <p>{feature.properties.procedures}</p>
          </div>
        ) : null}

        {events.today.length > 0 ? (
          <h2>
            Open Today:{" "}
            {events.today.map((event) => (
              <span key={event}>{event} </span>
            ))}
          </h2>
        ) : null}

        <div className="row">
          <div className="col-sm-7">
            <h2>Menu</h2>
            {feature.properties.menu?.url ? (
              <h4>
                <small>
                  <a className="url-break" href={feature.properties.menu.url} target="_blank" rel="noreferrer">
                    View menu/listing
                  </a>
                </small>
              </h4>
            ) : null}
            {feature.properties.menu?.text ? (
              <p>{feature.properties.menu.text}</p>
            ) : (
              <p className="small text-muted">
                {feature.properties.menu?.url
                  ? "Check the link for menu!"
                  : "Nothing here? We may not have gotten around to recording this information yet. Check with the venue for their menu."}
              </p>
            )}
          </div>
          <div className="col-sm-5">
            <h3>{events.today.length > 0 ? "Upcoming Dates" : "Upcoming Date(s)"}</h3>
            <ul className="list-unstyled">
              {events.future.length > 0 ? (
                events.future.map((event) => (
                  <li key={event}>
                    <small>{event}</small>
                  </li>
                ))
              ) : (
                <p className="small text-muted">
                  Nothing here? We may not have gotten around to recording this information yet. If it&apos;s not in the
                  notes below, check with the venue for dates/times.
                </p>
              )}
            </ul>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <BooleanPanel label="Homemade Pierogies" value={feature.properties.homemade_pierogies} />
          </div>
          <div className="col-sm-3">
            <BooleanPanel label="Alcohol Served" value={feature.properties.alcohol} />
          </div>
          <div className="col-sm-3">
            <BooleanPanel label="Lunch Served" value={feature.properties.lunch} />
          </div>
          <div className="col-sm-3">
            <BooleanPanel label="Open Good Friday" value={events.GoodFriday} />
          </div>
        </div>

        <div className="row margin">
          <div className="col-sm-3">
            <BooleanPanel label="Drive-Thru Available" value={feature.properties.drive_thru} />
          </div>
          <div className="col-sm-3">
            <BooleanPanel label="Take-Out Available" value={feature.properties.take_out} />
          </div>
          <div className="col-sm-3">
            <BooleanPanel label="Handicap Accessible" value={feature.properties.handicap} />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <h4>Notes</h4>
            {feature.properties.etc ? <p>{feature.properties.etc}</p> : null}
            {feature.properties.venue_notes ? <p>{feature.properties.venue_notes}</p> : null}
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <h4>Contact</h4>
            <table className="table table-condensed well">
              <tbody>
                <tr>
                  <th>Phone</th>
                  <td>{attrClean(feature.properties.phone)}</td>
                </tr>
                <tr>
                  <th>Venue Website</th>
                  <td>
                    {feature.properties.website ? (
                      <a className="url-break" href={feature.properties.website} target="_blank" rel="noreferrer">
                        Venue Website
                      </a>
                    ) : null}
                  </td>
                </tr>
                <tr>
                  <th>Email</th>
                  <td>
                    {feature.properties.email ? (
                      <a className="url-break" href={`mailto:${feature.properties.email}`}>
                        {feature.properties.email}
                      </a>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <p className="small text-muted">
          Do you have info on this Fish Fry that we don&apos;t? Send us a message on our{" "}
          <a href="https://www.facebook.com/PittsburghLentenFishFryMap/" target="_blank" rel="noreferrer">
            Facebook
          </a>{" "}
          page.
        </p>
        <button type="button" className="btn btn-default" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeatureModal;
