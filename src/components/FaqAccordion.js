import React, { useEffect, useState } from 'react'
import { Accordion } from 'react-bootstrap';
import './BorderlessAccordion.css'
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { useGetFaqsQuery } from '../features/api';
import Skeleton from 'react-loading-skeleton';


function FaqAccordion() {

  const {data,isLoading} = useGetFaqsQuery();
  const[items,setItems] = useState([])


  useEffect(()=>{
setItems(data?.faqs)
  },[data])
  

    const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <Accordion  className='border-0  borderless-accordion'>
    {isLoading? <Skeleton height={'3rem'} count={5}/>:
       items?.length>0 && items?.filter((item)=>item?.status === 'Active').map((item, index) => (
        <Accordion.Item className='my-2 border-0' eventKey={index} key={item?._id}>
          <Accordion.Header
              onClick={() => toggleAccordion(index)}
              className='border-0'
            >
              <div style={{ display: 'inline-block' }} className={`icon ${openIndex === index ? 'minus' : 'plus'}`}>
                {openIndex === index ? <FiMinusCircle /> : <FiPlusCircle />}
              </div>
              <span className='px-2'>{item?.title}</span>
          
          </Accordion.Header>
          {/* <Accordion.Collapse eventKey={index}> */}
            <Accordion.Body className='ps-5'>
              <p style={{fontSize:'0.9rem'}} >{item?.description}</p>
            </Accordion.Body>
          {/* </Accordion.Collapse> */}
        </Accordion.Item>
      ))}
    </Accordion>
  )
}

export default FaqAccordion