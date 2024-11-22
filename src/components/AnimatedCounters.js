import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';


function AnimatedCounter({ end, duration }) {
  const [isInView, setInView] = useState(false);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5, // Adjust the threshold as needed
  });

  useEffect(() => {
    if (inView) {
      setInView(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className={`counter ${isInView ? 'counters-visible' : ''}`}>
      <CountUp end={isInView ? end : 0} duration={duration} />
    </div>
  );
}



function AnimatedCounters() {

  const countersData = [
    { end: 600, duration: 5, label: 'Videos Uploaded' },
    { end: 10000, duration: 5, label: 'Subscribers' },
    { end: 10000, duration: 5, label: 'Global Downloads' },
    { end: 200, duration: 5, label: '5-star Reviews' },
  ];

  return (
    <Row className='text-white my-5 mb-5'>
    {countersData.map((counter, index) => (
      <Col key={index} className='text-center'>
        <div style={{ display: 'flex', alignItems: 'baseline',justifyContent:'center' }}>
          <h1 className='text-center p-0 m-0'>
            <AnimatedCounter end={counter.end} duration={counter.duration} />
          </h1>
          <span className='fs-1'>+</span>
        </div>
        <p className=''>{counter.label}</p>
      </Col>
    ))}
  </Row>
  );
}

export default AnimatedCounters