import React from 'react'
import {  Col, Row } from 'react-bootstrap'
import FaqAccordion from './FaqAccordion';

function HomeFAQ() {

    const bg = 'bg/faqbg.png';

  return (
    <section className='p-3  py-md-5 px-md-5'
     style={{backgroundImage:`url(${bg})`,backgroundSize:'cover',backgroundAttachment:'fixed', backgroundRepeat:'no-repeat'}}>
        <h2 className='text-center text-white my-4 fw-bold'>Frequently Asked Questions</h2>
        
        <Row className='d-flex  justify-content-center '>
  <Col md={10}>
  
   <FaqAccordion />
  </Col>
</Row>
        
       
    </section>
  )
}

export default HomeFAQ