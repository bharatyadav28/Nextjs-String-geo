import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Title from '../components/Title'
import OtpCard from '../components/OtpCard'

function OtpPage() {
  return (
    <section className='account-bg full-section'>
        <Container>
        {/* <Row>
          <Col className="text-center py-3">
            <HeaderLogo height={"80px"} />
          </Col>
        </Row> */}
        <Row className="d-flex justify-content-between pt-3 text-center">
          <Col>
            <Title
              title="OTP Verification"
              desc="Few steps away to create an account & Enjoy String Geo..!"
            />
          </Col>
          {/* <Col className="text-end">
            <Step step="2" />
          </Col> */}
        </Row>

    <OtpCard/>


        </Container>
    </section>
  )
}

export default OtpPage