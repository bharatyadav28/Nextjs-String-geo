import React from "react";
import ContentTitle from "../../components/ContentTitle";
import { Card, Col, Container, Row } from "react-bootstrap";
import { FaIndianRupeeSign, FaRegClock } from "react-icons/fa6";

function Careers() {
  const jobList = [
    {
      title: "Product designer",
      city: "Mumbai",
      state: "MH",
      description:
        "We’re looking for a mid-level product designer to join our team.",
      role: "Full-time",
      payment: "42k",
    },
    {
      title: "Fullstack developer",
      city: "Pune",
      state: "MH",
      description:
        "We’re looking for a mid-level Fullstack designer to join our team.",
      role: "Full-time",
      payment: "50k",
    },
    {
      title: "Manager",
      city: "Chennai",
      state: "TN",
      description: "We’re looking for a high-level Manager to join our team.",
      role: "Full-time",
      payment: "60k",
    },
    {
      title: "Content Creator ",
      city: "Nagpur",
      state: "MH",
      description: "We’re looking for a mid-level candidate to join our team.",
      role: "Full-time",
      payment: "30k",
    },
    {
      title: "Video editor ",
      city: "Mumbai",
      state: "MH",
      description: "We’re looking for a mid-level candidate to join our team.",
      role: "Full-time",
      payment: "25k",
    },
    {
      title: "Graphic designer",
      city: "Mumbai",
      state: "MH",
      description: "We’re looking for a mid-level candidate to join our team.",
      role: "Full-time",
      payment: "25k",
    },
    // Add more job entries as needed
  ];

  return (
    <section className="account-bg py-5">
      <ContentTitle
        title="We are looking for talented people"
        desc="We're a 100% remote team spread all across the world. Join us! "
      />

      <Container>
        <Row>
          <Col className="text-center text-white">
            <p>We&apos;re hiring</p>
            <p>
              Our philosophy is simple — hire a team of diverse, passionate
              people and foster a culture that empowers you to do your best
              work.
            </p>
          </Col>
        </Row>

        <Row>
          {jobList.map((job, index) => (
            <Col key={index} xs={12} md={6} lg={6}>
              <Card className="search-glass text-white rounded p-3 mb-3">
                <Row>
                  <Col>
                    {" "}
                    <p className="bold">{job.title}</p>
                  </Col>
                  <Col className="text-end">
                    {" "}
                    <p
                      className="rounded-pill px-2 py-1"
                      style={{
                        background: "rgba(173, 171, 171, 0.12)",
                        fontSize: "0.8rem",
                        display: "inline-block",
                      }}
                    >
                      {job.city}, {job.state}
                    </p>
                  </Col>
                </Row>

                <p>{job.description}</p>
                <Row style={{ fontSize: "0.8rem" }}>
                  <Col md={2}>
                    {" "}
                    <FaRegClock color="#CAA257" /> {job.role}
                  </Col>
                  <Col>
                    {" "}
                    <FaIndianRupeeSign color="#CAA257" /> {job.payment}
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default Careers;
