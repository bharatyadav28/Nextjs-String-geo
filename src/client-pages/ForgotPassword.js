import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Title from "../components/Title";
import ForgotPasswordCard from "../components/ForgotPasswordCard";
import OtpCard from "../components/OtpCard";

import { usePathname } from "next/navigation";

function ForgotPassword() {
  const pathname = usePathname();

  const isMailPage = pathname.includes("forgot-password-mail");
  const isOtpPage = pathname.includes("forgot-password-otp");
  const isResetPage = pathname.includes("forgot-password-reset");

  return (
    <section className="account-bg full-section">
      <Container>
        {/* <Row>
                    <Col className='text-center py-3'>
                        <HeaderLogo height={'80px'}/>
                    </Col>
                </Row> */}

        <Row className="pt-3 text-center">
          <Col>
            <Title
              title={
                isMailPage
                  ? "Forgot Password"
                  : isOtpPage
                  ? "Otp Verification"
                  : "Password Reset"
              }
            />
          </Col>
        </Row>

        <hr
          style={{ borderWidth: "3px", color: "rgba(255, 255, 255, 0.34)" }}
        />

        {isOtpPage ? <OtpCard /> : <ForgotPasswordCard />}
      </Container>
    </section>
  );
}

export default ForgotPassword;
