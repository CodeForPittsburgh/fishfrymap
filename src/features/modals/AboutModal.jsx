import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card, Col, Modal, Nav, Row, Tab } from "react-bootstrap";
import { faCircleExclamation, faCircleQuestion, faCode, faEnvelope } from "@/icons/fontAwesome";

const AboutModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" id="aboutModal">
      <Modal.Header closeButton>
        <Modal.Title>About the Pittsburgh Lenten Fish Fry Map</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="about">
          <Nav variant="tabs" fill id="aboutTabs">
            <Nav.Item>
              <Nav.Link eventKey="about">
                <FontAwesomeIcon icon={faCircleQuestion} /> About the project
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="contact">
                <FontAwesomeIcon icon={faEnvelope} /> Contact Us
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="disclaimer">
                <FontAwesomeIcon icon={faCircleExclamation} /> Disclaimer
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="build">
                <FontAwesomeIcon icon={faCode} /> Build With Us
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content id="aboutTabsContent" style={{ paddingTop: "10px" }}>
            <Tab.Pane eventKey="about">
              <h3>Fish Fry Map</h3>
              <p>
                The Pittsburgh Lenten Fish Fry Map is the brainchild of Hollen Barmer, who has tirelessly dedicated
                time the past few years to inventorying the rich array of Lenten Fish Fry events that occur every
                spring in Western Pennsylvania. Again this year, Friends of Fish Fries are helping.
              </p>

              <h3>Built with Open Source Software</h3>
              <p>
                The Fish Fry Map is open-source software, meaning that you can see how we made it and, if so inclined,
                use the source for your own projects. The current app is built with React, Redux Toolkit, Vite,{" "}
                <a href="http://getbootstrap.com/" target="_blank" rel="noreferrer">
                  Bootstrap
                </a>{" "}
                and{" "}
                <a href="http://leafletjs.com/" target="_blank" rel="noreferrer">
                  Leaflet
                </a>
                . Open source, MIT licensed, and available on{" "}
                <a href="https://github.com/CodeForPittsburgh/fishfrymap" target="_blank" rel="noreferrer">
                  GitHub
                </a>
                .
              </p>
            </Tab.Pane>

            <Tab.Pane eventKey="disclaimer">
              <p>This map and the data and software behind it is maintained entirely by volunteers.</p>
              <p>
                While we try our best to verify all details about Fish Fries, some details may be incomplete. Please
                check with the Fish Fry venue ahead of time to verify any details that are crucial to you having an
                enjoyable, fulfilling Fish Fry experience.
              </p>
            </Tab.Pane>

            <Tab.Pane eventKey="contact">
              <Card body bg="light">
                <Row>
                  <Col md={12}>
                    <p>
                      Head over to our{" "}
                      <a href="https://www.facebook.com/PittsburghLentenFishFryMap/">Facebook page</a> to suggest a
                      Fish Fry, share Fish Fry photos and news, and discuss all things Fish Fry!
                    </p>
                  </Col>
                </Row>
              </Card>
            </Tab.Pane>

            <Tab.Pane eventKey="build">
              <p>
                If you&apos;re interested in helping build the software behind the map, head over to the project
                repositories and dig in:
              </p>
              <ul>
                <li>
                  Fish Fry Form: Fish Fry Curation Tool:{" "}
                  <a href="https://github.com/CodeForPittsburgh/fishfryform">Repository</a> |{" "}
                  <a href="http://data.pghfishfry.org">Site</a>
                </li>
                <li>
                  Fish Fry Map (this site):{" "}
                  <a href="https://github.com/CodeForPittsburgh/fishfrymap">Repository</a>
                </li>
              </ul>
              <p>
                If you want to get the data used on this map and use it in your own projects, you have a couple of
                options:
              </p>
              <ul>
                <li>
                  Download the data from{" "}
                  <a href="https://data.wprdc.org/dataset/pittsburgh-fish-fry-map">WPRDC</a>. This is periodically
                  synced with our database.
                </li>
                <li>
                  Get the data as GeoJSON directly from the{" "}
                  <a href="https://data.pghfishfry.org/api/fishfries/">Fish Fry API</a>. We have limited hosting
                  resources. Please let us know if you plan on using the data on a high-traffic site.
                </li>
              </ul>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutModal;
