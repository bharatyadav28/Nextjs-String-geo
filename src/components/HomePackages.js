import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import SubscriptionCards from "./SubscriptionCards";

import { useRouter } from "next/navigation";

export function HomePackages() {
  const router = useRouter();

  const [isClientEnv, setIsClientEnv] = useState(false);

  useEffect(() => {
    setIsClientEnv(true);
  }, []);

  return (
    <section className="py-4 package-section" id="home-packages">
      <Container className="py-3">
        <Row>
          <Col className="text-center text-white">
            <p className="fs-4">
              Your subscription is a means of preserving the{" "}
              <span style={{ color: "var(--primary-color)", fontWeight: 700 }}>
                Truth
              </span>{" "}
              in society.
            </p>
            <h4 className="">
              <u>Subscription Plans</u>
            </h4>
          </Col>
        </Row>

        <SubscriptionCards onClick={() => router.push("/auth/signup")} />

        <Row>
          <Col className="text-center text-white pt-md-5 pt-4 home-package-text">
            <p
              className="mb-0"
              style={{
                fontSize: `${
                  isClientEnv && window.innerWidth >= 768 ? "1.25rem" : "0.8rem"
                }`,
              }}
            >
              String is the only standing platform in the world that is
              combating the bias of Big Tech.
            </p>
            <p
              style={{
                fontSize: `${
                  isClientEnv && window.innerWidth >= 768 ? "1.25rem" : "0.8rem"
                }`,
              }}
            >
              Through String come! Let’s tell the glory of Bharat and be a
              nightmare to the evil trying to destroy Sanatana Dharma.
            </p>
          </Col>
        </Row>
      </Container>
      {/* <PricingPackages /> */}
    </section>
  );
}
