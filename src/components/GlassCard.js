import React, { useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice";

import { useRouter, usePathname } from "next/navigation";

function GlassCard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { refreshToken } = useSelector(selectAuth);
  const isCreatedPage = pathname.includes("created");

  return (
    <Row className="d-flex justify-content-center align-items-center ">
      <Col md={8} sm={12} xs={12} lg={7} xl={8} className="">
        <Card
          data-aos="flip-up"
          data-aos-duration="1000"
          style={{ width: "100%" }}
          className={` p-3 px-md-5  rounded-4 glass-card ${
            isCreatedPage ? "" : "auth-card"
          }`}
        >
          <div>{children}</div>
        </Card>
      </Col>
    </Row>
  );
}

export default GlassCard;
