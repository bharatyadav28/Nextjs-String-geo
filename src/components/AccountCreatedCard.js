import React from "react";
import GlassCard from "./GlassCard";
import { FaRegCircleCheck } from "react-icons/fa6";
import { Button, Col, Row } from "react-bootstrap";
import { useRouter } from "next/navigation";

function AccountCreatedCard() {
  const router = useRouter();

  return (
    <Row className="d-flex justify-content-center align-items-center py-5">
      <Col md={10} sm={10} xs={10} lg={5} xl={5}>
        <GlassCard>
          <div className="text-center px-1">
            <Row className="d-flex justify-content-center">
              <Col md={2} className="text-center py-3 ">
                <div
                  className=" d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    color: "#3DFF0C",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <FaRegCircleCheck size={30} />
                </div>
              </Col>
            </Row>
            <h3 className="text-white">Account Created Successfully</h3>
            <p className="text-secondary">
              Your Account has been created successfully. Enjoy Beyond
              Entertainment. Towards Enlightenment
            </p>

            <Row className="text-center d-flex justify-content-center">
              <Col>
                <Button
                  variant="transparent"
                  size="lg"
                  className="text-white w-100 my-4 fw-bold form-btn"
                  onClick={() => router.push("/")}
                >
                  Take me String Home
                </Button>
              </Col>
            </Row>
          </div>
        </GlassCard>
      </Col>
    </Row>
  );
}

export default AccountCreatedCard;
