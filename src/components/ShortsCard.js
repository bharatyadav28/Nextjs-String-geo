import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./ShortsCard.css";
import { imgAddr } from "../features/api";

import { useRouter } from "next/navigation";
function ShortsCard({ short }) {
  const thumbnail = `${imgAddr}/${short?.thumbnail_url}`;

  const router = useRouter();

  const handleClick = () => {
    router.push(`/shorts/${short?.nick_name || short?._id}`);
  };

  return (
    <Card
      className="shorts-card rounded-4 border-0 bg-transparent d-flex justify-content-end"
      style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
      onClick={handleClick}
    >
      <div
        className="p-2 text-white rounded-bottom-4"
        style={{ backdropFilter: "blur(5px)", height: "15%" }}
      >
        <p className="" style={{ fontSize: "0.8rem" }}>
          {short?.title}
        </p>
      </div>
    </Card>
  );
}

export default ShortsCard;
