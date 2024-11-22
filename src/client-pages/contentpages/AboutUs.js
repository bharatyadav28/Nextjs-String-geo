"use client";
import React, { useEffect } from "react";
import ContentTitle from "../../components/ContentTitle";
import { Col, Container, Image, Row } from "react-bootstrap";
import QueAns from "../../components/QueAns";
import AnimatedCounters from "../../components/AnimatedCounters";
import {
  imgAddr,
  useGetAboutUsImagesQuery,
  useGetAboutUsQuery,
} from "../../features/api";

function AboutUs() {
  const bgImg = "bg/bghome.png";

  const { data: aboutUsData } = useGetAboutUsQuery();
  const { data: aboutUsImages } = useGetAboutUsImagesQuery();

  useEffect(() => {
    console.log(aboutUsData);
    console.log(aboutUsImages);
  }, [aboutUsData, aboutUsImages]);

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <section className="account-bg">
      <section className=" py-5">
        <ContentTitle
          title="About Us "
          desc="Learn more about the company and the team behind it"
        />

        <Container className="p">
          <Row>
            <Col className="p-3 text-white" lg={7}>
              {/* <h1 className='text-white my-5  '>Why String Geo</h1> */}
              {aboutUsData && (
                <div
                  dangerouslySetInnerHTML={createMarkup(
                    aboutUsData?.page?.description
                  )}
                />
              )}
            </Col>
            <Col>
              <Row xs={3}>
                {aboutUsImages?.abouts?.map((img, index) => (
                  <Col key={img?._id} className="p-1">
                    <Image
                      fluid
                      src={`${imgAddr}/${img?.image_url}`}
                      className="rounded"
                      style={{ aspectRatio: "16/9" }}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <section className='p-5 ' style={{ backgroundImage: `url(${bgImg})`, backgroundSize: '100% ', backgroundRepeat: 'no-repeat',height:'90vh' }}>

    <Row className='d-flex justify-content-end align-items-center' style={{height:'100%'}}>
            <Col md={5}>
              <Image src='logo/StringGeoLogoBrand.png' fluid style={{ maxHeight: '200px' }} />
              <Row>
                <Col className=''>
                  <p style={{color:'#CAA257'}}>Build better, launch faster</p>
                  <h1 className='text-white'>We're only just getting started on our journey</h1>
                </Col>
              </Row>
            </Col>
          </Row>

    </section> */}
      {/* <section >
        <Container className='py-5 '>
           
                <AnimatedCounters/>
           
        

        </Container>

    </section> */}
    </section>
  );
}

export default AboutUs;
