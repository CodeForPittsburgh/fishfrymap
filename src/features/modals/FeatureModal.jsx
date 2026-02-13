import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { Alert, Button, Card, Col, Modal, Row, Table } from "react-bootstrap";

import { attrClean, boolValue } from "@/domain/featureUtils";
import { parseDateTimes } from "@/domain/dateUtils";
import { faCheck, faQuestion, faXmark } from "@/icons/fontAwesome";

function BooleanPanel({ label, value }) {
  const isTrue = boolValue(value);
  const isFalse = value === false || ["false", "False", 0, "No", "no"].includes(value);

  let icon = <FontAwesomeIcon icon={faQuestion} size="2x" aria-hidden="true" />;
  let text = "Unsure";
  let variantClass = "";

  if (isTrue) {
    icon = <FontAwesomeIcon icon={faCheck} size="2x" aria-hidden="true" />;
    text = "Yes";
    variantClass = "bool-card-true";
  } else if (isFalse) {
    icon = <FontAwesomeIcon icon={faXmark} size="2x" aria-hidden="true" />;
    text = "No";
  }

  return (
    <Card className={`h-100 ${variantClass}`.trim()}>
      <Card.Body>
        <p className="text-center">{label}</p>
        <p className="text-center">
          {icon}
          <br />
          <small>{text}</small>
        </p>
      </Card.Body>
    </Card>
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
          <Row>
            <Col md={9}>
              <h3 className="modal-title">
                <span id="feature-title">{attrClean(feature.properties.venue_name)}</span>
              </h3>
            </Col>
            <Col md={3}>
              <h3 className="modal-title text-md-end">
                <small>{attrClean(feature.properties.venue_type)}</small>
              </h3>
            </Col>
          </Row>
          <Row>
            <Col md={9}>
              <h4 className="modal-title">
                <span id="feature-subtitle">{address}</span>&nbsp;
              </h4>
            </Col>
            <Col md={3}>
              <h4 className="modal-title text-md-end">
                <small>
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    Get directions &rarr;
                  </a>
                </small>
              </h4>
            </Col>
          </Row>
        </div>
      </Modal.Header>
      <Modal.Body>
        {!feature.properties.publish ? (
          <Alert variant="info">
            <h4>
              This Fish Fry has not yet been verified this year. If you have info about this location for {currentYear},
              please head to our <a href="https://www.facebook.com/PittsburghLentenFishFryMap/">Facebook page</a>.
            </h4>
          </Alert>
        ) : null}

        {feature.properties.procedures ? (
          <Alert variant="info">
            <h4>A Note About Operations with COVID-19</h4>
            <p>{feature.properties.procedures}</p>
          </Alert>
        ) : null}

        {events.today.length > 0 ? (
          <h2>
            Open Today:{" "}
            {events.today.map((event) => (
              <span key={event}>{event} </span>
            ))}
          </h2>
        ) : null}

        <Row>
          <Col sm={7}>
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
          </Col>
          <Col sm={5}>
            <h3>{events.today.length > 0 ? "Upcoming Dates" : "Upcoming Date(s)"}</h3>
            <ul className="list-unstyled">
              {events.future.length > 0 ? (
                events.future.map((event) => (
                  <li key={event}>
                    <small>{event}</small>
                  </li>
                ))
              ) : (
                <li className="small text-muted">
                  Nothing here? We may not have gotten around to recording this information yet. If it&apos;s not in the
                  notes below, check with the venue for dates/times.
                </li>
              )}
            </ul>
          </Col>
        </Row>

        <Row>
          <Col sm={3}>
            <BooleanPanel label="Homemade Pierogies" value={feature.properties.homemade_pierogies} />
          </Col>
          <Col sm={3}>
            <BooleanPanel label="Alcohol Served" value={feature.properties.alcohol} />
          </Col>
          <Col sm={3}>
            <BooleanPanel label="Lunch Served" value={feature.properties.lunch} />
          </Col>
          <Col sm={3}>
            <BooleanPanel label="Open Good Friday" value={events.GoodFriday} />
          </Col>
        </Row>

        <Row className="margin">
          <Col sm={3}>
            <BooleanPanel label="Drive-Thru Available" value={feature.properties.drive_thru} />
          </Col>
          <Col sm={3}>
            <BooleanPanel label="Take-Out Available" value={feature.properties.take_out} />
          </Col>
          <Col sm={3}>
            <BooleanPanel label="Handicap Accessible" value={feature.properties.handicap} />
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h4>Notes</h4>
            {feature.properties.etc ? <p>{feature.properties.etc}</p> : null}
            {feature.properties.venue_notes ? <p>{feature.properties.venue_notes}</p> : null}
          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <h4>Contact</h4>
            <Table size="sm" striped bordered>
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
            </Table>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <p className="small text-muted">
          Do you have info on this Fish Fry that we don&apos;t? Send us a message on our{" "}
          <a href="https://www.facebook.com/PittsburghLentenFishFryMap/" target="_blank" rel="noreferrer">
            Facebook
          </a>{" "}
          page.
        </p>
        <Button type="button" variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeatureModal;
