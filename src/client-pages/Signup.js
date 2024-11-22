import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Title from "../components/Title";
import SignupCard from "../components/SignupCard";
import ScrollToTop from "../components/ScrollToTop";

function Signup() {
  return (
    <section className="account-bg full-section">
      <ScrollToTop />
      <Container>
        {/* <Row>
          <Col className="text-center py-3">
            <HeaderLogo height={"80px"} />
          </Col>
        </Row> */}
        <Row className="d-flex justify-content-between pt-3 text-center">
          <Col>
            <Title
              title="Sign Up"
              desc="Let's create your account & Enjoy String Geo..!"
            />
          </Col>
          {/* <Col className="text-end">
            <Step step="1" />
          </Col> */}
        </Row>

        <SignupCard />
      </Container>
    </section>
  );
}

export default Signup;
