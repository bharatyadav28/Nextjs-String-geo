import React from "react";
import ContentTitle from "../../components/ContentTitle";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import FaqAccordion from "../../components/FaqAccordion";

import { useRouter } from "next/navigation";

function FAQPage() {
  const router = useRouter();

  return (
    <section className="account-bg py-5">
      <ContentTitle
        title="Frequently Asked Questions"
        desc="Everything you need to know about the platform and billing "
      />

      <Container>
        <Row className="d-flex  justify-content-center ">
          <Col md={8}>
            <FaqAccordion />
          </Col>
        </Row>

        <Row>
          <Col
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
            className="text-center text-white rounded my-2 mt-5 py-4"
          >
            {/* <Image src='/images/avatargroup.png'  style={{maxHeight:'35px'}} fluid /> */}
            <h5 className="my-2">Still have question?</h5>
            <p>
              Can&apos;t find the answer you&apos;re looking for? Please chat to
              our friendly team.
            </p>

            <Button
              className="px-3 form-btn border-0"
              onClick={() => router.push("/contact-us")}
            >
              Get in touch
            </Button>
            <Row>
              <Col></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default FAQPage;
