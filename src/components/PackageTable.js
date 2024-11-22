import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { FaCheck, FaXmark } from "react-icons/fa6";

import { useRouter } from "next/navigation";
function PackageTable() {
  const check = <FaCheck color="white" />;
  const xmark = <FaXmark color="white" />;

  const router = useRouter();

  const tableData = [
    {
      title: "Access to All content",
      basic: check,
      standard: check,
      premium: check,
    },
    {
      title: "1080[Full HD]",
      basic: check,
      standard: <>{check} [Ultra HD]</>,
      premium: <>{check} [4k Quality]</>,
    },
    {
      title: "Exclusive Access to Series",
      basic: xmark,
      standard: check,
      premium: check,
    },
    {
      title: "No Adds & No Extra Fee",
      basic: check,
      standard: check,
      premium: check,
    },
    { title: "User Access", basic: "1", standard: "2", premium: "4" },
  ];

  const [selectedSwitch, setSelectedSwitch] = useState("monthly");

  const handleSwitchChange = (value) => {
    setSelectedSwitch(value);
  };

  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardSelect = (planName) => {
    setSelectedCard(planName);
  };

  function PriceCard({ prevPrice, price, planName }) {
    return (
      <Card
        className={`glass-card p-3 m-2 ${
          selectedCard === planName ? "selected-card" : ""
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => handleCardSelect(planName)}
      >
        <Row>
          <Col>{planName}</Col>
        </Row>
        <Row>
          <Col md={4}>
            <div className="bg-light rounded text-dark p-3 prev-card">
              <p className="mb-0">
                {selectedSwitch === "monthly" ? "Monthly" : "Annual"}
              </p>
              <s>₹{prevPrice}</s>
            </div>
          </Col>
          <Col className="d-flex align-items-center">
            <h2>
              ₹{price}/{selectedSwitch === "monthly" ? "Month" : "year"}
            </h2>
          </Col>
        </Row>
      </Card>
    );
  }

  return (
    <section className="py-4">
      <Table responsive borderless className="bg-none package-table ">
        <thead>
          <tr>
            <td></td>
            <td className="py-3 text-center border-start border-top billing-table-head">
              Basic Plan
            </td>
            <td className="py-3 text-center border-top billing-table-head">
              Standard Plan
            </td>
            <td className="py-3 text-center border-end border-top billing-table-head">
              Premium Plan
            </td>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data, index) => (
            <tr key={index}>
              <td>{data.title}</td>
              <td
                className={`text-center border-start ${
                  index === tableData.length - 1 ? "border-bottom" : ""
                }`}
              >
                {data.basic}
              </td>
              <td
                className={`text-center ${
                  index === tableData.length - 1 ? "border-bottom" : ""
                }`}
              >
                {data.standard}
              </td>
              <td
                className={`text-center border-end ${
                  index === tableData.length - 1 ? "border-bottom" : ""
                }`}
              >
                {data.premium}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="text-white text-center mt-5">Select Billing type</p>
      <Row>
        <Col></Col>
        <Col md={3} className="">
          <div
            className="switches-container border p-2 rounded"
            style={{ position: "relative", bottom: "-50%" }}
          >
            <div
              className={`rounded switch ${
                selectedSwitch === "monthly" ? "selected" : ""
              }`}
              onClick={() => handleSwitchChange("monthly")}
            >
              Monthly billing
            </div>
            <div
              className={`rounded switch ${
                selectedSwitch === "annually" ? "selected" : ""
              }`}
              onClick={() => handleSwitchChange("annually")}
            >
              Annually billing
            </div>
            <div
              className="slider rounded"
              style={{ left: selectedSwitch === "monthly" ? "0%" : "50%" }}
            />
          </div>
        </Col>
        <Col></Col>
      </Row>

      <Row>
        <hr
          className="mb-5"
          style={{ borderWidth: "2px", color: "rgba(255, 255, 255, 1)" }}
        />
        {selectedSwitch === "monthly" ? (
          <>
            <Col>
              <PriceCard planName={"Basic Plan"} prevPrice={1188} price={999} />
            </Col>
            <Col>
              <PriceCard
                planName={"Standard Plan"}
                prevPrice={3588}
                price={2999}
              />
            </Col>
            <Col>
              <PriceCard
                planName={"Premium Plan"}
                prevPrice={4788}
                price={3999}
              />
            </Col>
          </>
        ) : (
          <>
            <Col>
              <PriceCard planName={"Basic Plan"} prevPrice={188} price={99} />
            </Col>
            <Col>
              <PriceCard
                planName={"Standard Plan"}
                prevPrice={588}
                price={299}
              />
            </Col>
            <Col>
              <PriceCard
                planName={"Premium Plan"}
                prevPrice={788}
                price={399}
              />
            </Col>
          </>
        )}

        <hr
          className="mt-3"
          style={{ borderWidth: "2px", color: "rgba(255, 255, 255, 1)" }}
        />
      </Row>
      <Row className="text-center d-flex justify-content-center">
        <Col md={3}>
          <Button
            variant="transparent"
            className="text-white w-100 my-3 fw-bold form-btn"
            onClick={() => router.push("/auth/created")}
          >
            Select Card & Proceed
          </Button>
        </Col>
      </Row>
    </section>
  );
}

export default PackageTable;
