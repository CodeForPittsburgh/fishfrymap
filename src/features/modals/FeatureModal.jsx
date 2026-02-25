
import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faLocationArrow,
  faQuestion,
  faWarning,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import { Alert, Button, Card, Col, Modal, Row, Table, ListGroup, ListGroupItem } from "react-bootstrap";

import { attrClean, boolValue } from "@/domain/featureUtils";
import { parseDateTimes, downloadICS, parseEventRange } from "@/domain/dateUtils";
import { FEATURE_BOOLEAN_FIELD_CONFIG } from "@/domain/filterFieldConfig";
import { getPrimaryFilterFieldIcon } from "@/icons/filterFieldIcons";
import "./FeatureModal.css";

// Sub-component to display a boolean value with an icon and label
const BooleanPanel = ({ label, value, trueIcon }) => {
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

// Sub-component to display the contact information in a table
const ContactTable = ({ feature }) => (
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
)

// Sub-component to display one upcoming time with an ICS link when parseable
const UpcomingDateTime = ({ dateKey, time, venueName, venueAddress, description }) => {
  const range = parseEventRange(dateKey, time);

  if (!range) {
    return <p className="my-0">{time}</p>;
  }

  const handleICS = (event) => {
    event.preventDefault();
    downloadICS({
      title: `${venueName} Fish Fry`,
      location: venueAddress,
      description,
      startDateTime: range.start,
      endDateTime: range.end,
    });
  };

  return (
    <div class="d-grid gap-2">
      <a class="btn btn-outline-primary btn-sm my-1" href="#" role="button" onClick={handleICS} title="Add to calendar">
        {time}
      </a>
    </div>
  );
};

const UpcomingDatesColumn = ({ events, hasOpenToday, venueName, venueAddress, menuUrl }) => {
  const description = `Fish Fry at ${venueName}${menuUrl ? ` | Menu: ${menuUrl}` : ""}`;

  return (
    <div id="upcoming-dates-column">
      <h3>{hasOpenToday ? "Upcoming Dates" : "Upcoming Date(s)"}</h3>
      <ListGroup className="mb-3 shadow">
        {events.futureGroups.length > 0 || events.closedOnGoodFriday ? (
          <>
            {events.futureGroups.map((group) => (
              <ListGroupItem key={group.dateKey}>
                <Row>
                  <Col sm={6} className="d-flex align-items-center">
                      <p className="fw-bold fs-5 mb-0">
                        {group.isGoodFriday ? (
                          <>
                            Open Good Friday<br />
                            {group.dateLabel}
                          </>
                        ) : group.dateLabel}
                      </p>
                  </Col>
                  <Col sm={6}>
                    {group.times.map((time, index) => (
                      <UpcomingDateTime
                        key={`${group.dateKey}-${index}`}
                        dateKey={group.dateKey}
                        time={time}
                        venueName={venueName}
                        venueAddress={venueAddress}
                        description={description}
                      />
                    ))}
                  </Col>
                </Row>
              </ListGroupItem>
            ))}
            {events.closedOnGoodFriday ? (
              <ListGroupItem key="closed-on-good-friday">
                <small>Closed on Good Friday</small>
              </ListGroupItem>
            ) : null}
          </>
        ) : (
          <li className="list-group-item small text-muted">
            Nothing here? We may not have gotten around to recording this information yet. If it's not in the
            notes below, check with the venue for dates/times.
          </li>
        )}
      </ListGroup>
    </div>
  );
}

// Main component to display the feature details in a modal
const FeatureModal = ({ show, onHide, feature, currentYear }) => {

  const events = useMemo(() => {
    if (!feature) {
      return {
        today: [],
        future: [],
        futureGroups: [],
        closedOnGoodFriday: false,
        GoodFriday: false
      };
    }
    return parseDateTimes(feature.properties.events, moment());
  }, [feature]);

  if (!feature) {
    return null;
  }

  const venueName = attrClean(feature.properties.venue_name);
  const venueAddress = attrClean(feature.properties.venue_address);
  const menuUrl = feature.properties.menu?.url;
  const hasOpenToday = events.today.length > 0;
  const hasMenuText = !!feature.properties.menu?.text;
  const directionsUrl = `https://www.google.com/maps/dir//${encodeURIComponent(venueAddress)}`;
  const booleanPanels = FEATURE_BOOLEAN_FIELD_CONFIG.map((field) => ({
    key: field.key,
    label: field.label,
    trueIcon: getPrimaryFilterFieldIcon(field),
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
            <span id="feature-title">{venueName}</span>
          </h3>
          <span className="fs-6 text-secondary">
            {attrClean(feature.properties.venue_type)}
          </span>
        </div>
      </Modal.Header>
      <Modal.Body className="p-3">

        <Row className="mb-3 pb-3 border-bottom border-secondary">
          <Col md={8}>
            <span id="feature-subtitle" className="fs-5">{venueAddress}</span>
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

        {feature.properties.publish ? null : (
          // if it's not published, we show the contact info up here instead of at the bottom
          <div className="mb-3 pb-3 border-bottom border-secondary">
            <ContactTable feature={feature} />
          </div>
        )}


        {/* if the feature is not published everything in this div is faded out */}
        <div
          id="feature-info-content"
          className={!feature.properties.publish ? "is-unpublished" : ""}
        >

          {feature.properties.procedures ? (
            <Alert variant="warning">
              <p> <FontAwesomeIcon icon={faWarning} /> Something important to note about this Fish Fry:</p>
              <p className="fs-4">{feature.properties.procedures}</p>
            </Alert>
          ) : null}

          {hasOpenToday && feature.properties.publish ? (
            <h2>
              Open Today:{" "}
              {events.today.map((event) => (
                <span key={event}>{event} </span>
              ))}
            </h2>
          ) : null}



          <Row className="mb-3">
            <Col lg={hasMenuText ? 7 : 4}>
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
            <Col lg={hasMenuText ? 5 : 8}>
              <UpcomingDatesColumn
                events={events}
                hasOpenToday={hasOpenToday}
                venueName={venueName}
                venueAddress={venueAddress}
                menuUrl={menuUrl}
              />
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

        </div>


        {!feature.properties.publish ? null : (
          <ContactTable feature={feature} />
        )}


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
