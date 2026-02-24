import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faBeerMugEmpty,
  faCheck,
  faClock,
  faLocationArrow,
  faPlus,
  faQuestion,
  faWarning,
  faUtensils,
  faWheelchair,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Alert, Button, Card, Col, Modal, Row, Table } from "react-bootstrap";

import { attrClean, boolValue } from "@/domain/featureUtils";
import { parseDateTimes } from "@/domain/dateUtils";
import { FEATURE_BOOLEAN_FIELD_CONFIG } from "@/domain/filterFieldConfig";
import "./FeatureModal.css";

const TRUE_ICON_LOOKUP = {
  bagShopping: faBagShopping,
  beerMugEmpty: faBeerMugEmpty,
  clock: faClock,
  plus: faPlus,
  utensils: faUtensils,
  wheelchair: faWheelchair
};

function BooleanPanel({ label, value, trueIcon }) {
  const isTrue = boolValue(value);
  const isFalse = value === false || ["false", "False", 0, "No", "no"].includes(value);

  let icon = <FontAwesomeIcon icon={faQuestion} size="2x" aria-hidden="true" />;
  let text = "Unsure";
  let variantClass = "";

  if (isTrue) {
    icon = <FontAwesomeIcon icon={trueIcon || faCheck} size="2x" aria-hidden="true" />;
    text = "Yes";
    variantClass = "bool-card-true";
  } else if (isFalse) {
    icon = <FontAwesomeIcon icon={faXmark} size="2x" aria-hidden="true" />;
    text = "No";
  }

  return (
    <div className="ratio ratio-1x1 shadow">
      <Card className={`h-100 bool-panel-card ${variantClass}`.trim()}>
        <Card.Body className="bool-panel-body">
          <p className="text-center mb-2">{label}</p>
          <p className="text-center mb-0">
            {icon}
            <br />
            <small>{text}</small>
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

const FeatureModal = ({ show, onHide, feature, currentYear }) => {
  const events = useMemo(() => {
    if (!feature) {
      return {
        today: [],
        future: [],
        GoodFriday: false
      };
    }

    return parseDateTimes(feature.properties.events, moment());
  }, [feature]);

  if (!feature) {
    return null;
  }

  const address = attrClean(feature.properties.venue_address);
  const directionsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(address)}`;
  const booleanPanels = FEATURE_BOOLEAN_FIELD_CONFIG.map((field) => ({
    key: field.key,
    label: field.label,
    trueIcon: TRUE_ICON_LOOKUP[field.filterIconKeys[0]] || null,
    value: feature.properties[field.key]
  }));

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      fullscreen={'md-down'}
      id="featureModal"
      className="shadow-lg"
    >
      <Modal.Header closeButton>
        <div id="feature-info-header">
          <h3>
            <span id="feature-title">{attrClean(feature.properties.venue_name)}</span>
          </h3>
          <span className="fs-6 text-secondary">
            {attrClean(feature.properties.venue_type)}
          </span>
        </div>
      </Modal.Header>
      <Modal.Body className="p-3">

          <Row className="mb-3 pb-3 border-bottom border-secondary">
            <Col md={8}>
              <span id="feature-subtitle" className="fs-5">{address}</span>
            </Col>
            <Col md={4}>
              <Button
                href={directionsUrl} target="_blank" rel="noreferrer"
                className="w-100"
                size="sm"
              >
                Get Directions <FontAwesomeIcon icon={faLocationArrow}></FontAwesomeIcon>
              </Button>
            </Col>
          </Row>

        

        {!feature.properties.publish ? (
          <Alert variant="info" className="my-3">
            <h4>
              This Fish Fry has not yet been verified this year. If you have info about this location for {currentYear},
              please head to our <a href="https://www.facebook.com/PittsburghLentenFishFryMap/">Facebook page</a>.
            </h4>
          </Alert>
        ) : null}

        {feature.properties.procedures ? (
          <Alert variant="warning">
            <p> <FontAwesomeIcon icon={faWarning}/> Something important to note about this Fish Fry:</p>
            <p className="fs-4">{feature.properties.procedures}</p>
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

        <Row className="mb-3">
          <Col lg={7}>
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
          <Col lg={5}>
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

        <Row xs={2} sm={2} md={3} lg={5} xl={12} className="g-2 mb-3">
          {booleanPanels.map((panel) => (
            <Col key={panel.key}>
              <BooleanPanel label={panel.label} value={panel.value} trueIcon={panel.trueIcon} />
            </Col>
          ))}
        </Row>

        {feature.properties.etc || feature.properties.venue_notes ? (

          <Row>
            <Col sm={12}>
              <h4>Notes</h4>
              {feature.properties.etc ? <p>{feature.properties.etc}</p> : null}
              {feature.properties.venue_notes ? <p>{feature.properties.venue_notes}</p> : null}
            </Col>
          </Row>

        ) : (null)
        }


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
