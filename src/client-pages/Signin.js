import React, { Suspense } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeaderLogo from "../components/HeaderLogo";
import SigninCard from "../components/SigninCard";
import Title from "../components/Title";
import ScrollToTop from "../components/ScrollToTop";

function Signin() {
  return (
    <section className="account-bg full-section">
      <ScrollToTop />
      <Container>
        {/* <Row>
                    <Col className='text-center py-3'>
                        <HeaderLogo height={'80px'}/>
                    </Col>
                </Row> */}
        <Row className="pt-3 text-center">
          <Col>
            <Title title="Sign In" />
          </Col>
        </Row>
        <hr
          style={{ borderWidth: "3px", color: "rgba(255, 255, 255, 0.34)" }}
        />

        <Suspense fallback={<div>Loading...</div>}>
          <SigninCard />\
        </Suspense>
      </Container>
    </section>
  );
}

export default Signin;
