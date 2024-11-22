import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import HeaderLogo from '../components/HeaderLogo'
import AccountCreatedCard from '../components/AccountCreatedCard'

function AccountCreated() {
  return (
    <section className="account-bg full-section">
      <Container>
      <Row>
          <Col className="text-center py-3">
            <HeaderLogo height={"80px"} />
          </Col>
        </Row>
        <AccountCreatedCard/>
        </Container>
        </section>
  )
}

export default AccountCreated