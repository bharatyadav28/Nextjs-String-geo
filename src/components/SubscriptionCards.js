import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { useGetPlansQuery } from "../features/api";
import Skeleton from "react-loading-skeleton";
import { publicIpv4 } from "public-ip";
import ipLocation from "iplocation";
import "./SubscriptionCard.css";
import { motion } from "framer-motion";

import { usePathname } from "next/navigation";

function SubscriptionCards({ setSelected, selected, onClick, setINRPayment }) {
  const { data, isLoading } = useGetPlansQuery();
  const [plans, setPlans] = useState([]);
  const [INR, setINR] = useState(true);
  const [curSymbol, setCurSymbol] = useState("₹");
  const pathname = usePathname();
  const isBillingPage = pathname.includes("billing");
  useEffect(() => {
    setCurSymbol(INR ? "₹" : "$");
  }, [INR]);

  const fetchCountry = async () => {
    try {
      const ip = await publicIpv4();
      const data = await ipLocation(ip);

      if (data) {
        setINR(data?.country?.name === "India");
        setINRPayment && setINRPayment(data?.country?.name === "India");
      }
    } catch (error) {
      console.error("Error fetching country:", error);
    }
  };

  useEffect(() => {
    setPlans(data?.plans);
  }, [data]);

  useEffect(() => {
    fetchCountry();
  }, []);

  //   const isSmallScreen = useMediaQuery({ maxWidth: 991 });

  // const pricePm = 99;
  // const price = 999;
  // const prevPrice =1188;
  // const isSelected = selected === price;

  function PriceCard({ title, devices, planId, prices, animationDelay }) {
    const planTypeMap = {
      monthly: "Month",
      annual: "Year",
    };

    const annualSave = () => {
      return (
        <p className="rounded px-2 save-pill">
          Save {curSymbol}
          {INR
            ? prices[0]?.inr_price * 12 - prices[1]?.inr_price
            : prices[0]?.usd_price * 12 - prices[1]?.usd_price}
        </p>
      );
    };
    return (
      <Card
        //    data-aos="flip-right"
        //    data-aos-duration="1000"
        //    data-aos-anchor-placement="top-center"
        // data-aos-offset="400"
        //    data-aos-delay={animationDelay}

        className="text-white rounded-4 p-4 m-1 plan-card m-1"
        style={{ height: "100%" }}
      >
        <h1
          className="text-center nexa-heavy text-nowrap"
          style={{ color: "rgba(202, 162, 87, 1)" }}
        >
          {title.toUpperCase()}
        </h1>
        <Row>
          <Col className="text-center my-3">
            <Image
              src={
                devices === 1 ? "/images/individual.png" : "/images/family.png"
              }
              fluid
              style={{ height: "50px", width: "50px" }}
              className=""
            />
          </Col>
        </Row>
        <ul style={{ display: "grid", gap: "0.7rem" }}>
          <li>
            {" "}
            Number of Devices:{" "}
            <span style={{ fontWeight: 600 }}>{devices}</span>
          </li>
          <li> Access to all content</li>
          <li>
            {" "}
            Max video quality: <span style={{ fontWeight: 600 }}>FHD</span>
          </li>
          <li> Watch on Laptop/Mobile/Tab/iPad</li>
        </ul>
        {/* <Row>
          <Col className="text-center">
            <h3>Annual</h3>
           
          </Col>
        </Row> */}

        <Row className="mt-4">
          {prices?.map((price, index) => (
            <Col
              key={index}
              className="p-1 d-flex flex-column align-items-center justify-content-end text-center"
            >
              {price?.plan_type === "annual" ? (
                <div>
                  <h4>Annual</h4>
                  {annualSave()}
                </div>
              ) : null}
              <Card
                //  onClick={()=>{setSelected && setSelected({planId, plan_typeId:price?._id})} }
                onClick={() =>
                  onClick &&
                  onClick({
                    plan_id: price?.plan_id,
                    planId,
                    plan_typeId: price?._id,
                    paypal_plan_id: price?.paypal_plan_id,
                  })
                }
                className={`${
                  price?.plan_type === "annual" ? "annual-subcard" : ""
                } price-card bg-transparent p-3 my-1 text-center d-flex align-content-center justify-content-center text-white ${
                  selected?.plan_typeId === price._id ? "selected-card" : ""
                }`}
                style={{
                  height: "fit-content",
                  width: "100%",
                  cursor: "pointer",
                }}
              >
                {selected?.plan_typeId === price?._id ? (
                  <Image
                    src="/images/check.svg"
                    height={"25px"}
                    style={{ position: "absolute", right: "-5%", top: "-18%" }}
                  />
                ) : null}
                <p className="m-0">
                  <h4 className="fw-bold d-inline m-0"> {curSymbol}</h4>
                  <h4 className="fw-bold price d-inline m-0">
                    {INR ? price?.inr_price : price?.usd_price}
                  </h4>
                  /
                  <span className=" text-nowrap text-lowercase">
                    {planTypeMap[price?.plan_type] || "NA"}
                  </span>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      // animate={{opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Container className=" px-lg-5 ">
        <Row className="d-flex align-items-center justify-content-center">
          <Col lg={8} md={12} className=" text-white ">
            <Row>
              {isLoading ? (
                <>
                  <Col lg={6} md={6} className="p-1">
                    <Skeleton height={"450px"} width={"100%"} />
                  </Col>
                  <Col>
                    <Skeleton height={"450px"} width={"100%"} />
                  </Col>
                </>
              ) : plans?.length > 0 ? (
                plans?.map((plan, index) => (
                  <Col lg={6} md={6} key={index} className="p-1">
                    <PriceCard
                      title={plan?.name}
                      planId={plan?._id}
                      devices={plan?.allow_devices}
                      prices={plan?.prices}
                      animationDelay={index * 200 + 200}
                    />
                  </Col>
                ))
              ) : null}
            </Row>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}

export default SubscriptionCards;
