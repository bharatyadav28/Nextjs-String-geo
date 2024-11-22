import React, { useEffect, useState } from 'react';
import {  Button, Col,  Row } from 'react-bootstrap';
import ShortsCard from '../components/ShortsCard';
import { useGetAllShortsMutation, useGetFreeVideosMutation } from '../features/api';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import ScrollToTop from '../components/ScrollToTop';
import { FaArrowUp } from 'react-icons/fa6';

function AllShorts() {
    const [getAllShorts, {}] = useGetAllShortsMutation();
    const [currentPage, setCurrentPage] = useState(1);
    const [shortsData, setShortsData] = useState([]);
    const [newShortsData, setNewShortsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalVideoCount, setTotalVideoCount] = useState(0);
    const [dataLength, setDataLength] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [contentData, setContentData] = useState(null);


    const fetchAllShorts = async () => {
        try {
            const parameters = `?&resultPerPage=12&currentPage=${currentPage}`;
            const data = await getAllShorts(parameters).unwrap();            
            // const newData = [];
            // newData = data?.shorts;
    
            // Update the state variable to append the new data to the 2D array
           
            // setContentData(prev => [...prev, newData]);
            console.log(data?.shorts)
            if (currentPage === 1) {
                setShortsData(data?.shorts);
                setNewShortsData(data?.shorts);
                // setContentData(data?.shorts);
            } else {
                // setContentData(prev => [...prev, data?.shorts]);
                setNewShortsData(data?.shorts);
                setShortsData(prev => [...prev, ...data?.shorts]);
                   
            }

            setTotalVideoCount(data?.totalShorts);

            console.log(data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllShorts();
    }, [currentPage]);



    useEffect(() => {
      setDataLength(shortsData?.length)
        setHasMore(totalVideoCount > shortsData?.length);
      

    }, [totalVideoCount,  shortsData]);


    const bg = 'bg/homecontent.svg';


      const handleNextPage = () => {
        console.log( shortsData?.length, totalVideoCount)
        if (!loading && shortsData?.length < totalVideoCount) {
            // setLoading(true);
            setCurrentPage(prev => prev + 1);
        }
    };
  

  
    
    const renderContent = () => {
      return (
      <React.Fragment>
          <Row xs={2} sm={3} md={3} lg={6} xl={6} className="mx-md-4 mt-2">
     { shortsData && shortsData?.map((short, index) => (
                
                      <Col key={short?._id} className="m p-2 d-flex align-items-center justify-content-center">
                          <ShortsCard
                             short={short}
                          />
                      </Col>
                  ))}
              </Row>
             
          </React.Fragment>
      );
  };
    return (
        <section className=" full-section" style={{ backgroundImage: `url(${bg})`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' }}>
          <ScrollToTop/>
          <h3 className='text-white ms-md-5 ms-3 mt-4'>Shorts</h3>

      {loading ?
    <Row xs={2} sm={3} md={3} lg={6} xl={6} className="mx-md-4 ">

    {[1,2,3,4,5,6].map((_,i)=>(
          <Col key={i}>
             <Skeleton  style={{aspectRatio:'9/16',height:'20rem'}} count={1}/>
             </Col>
    ))}
    </Row>  
    :
          <InfiniteScroll
                // style={{marginBottom:'4rem'}}
                className='free-section px-3'
                dataLength={dataLength}
                next={handleNextPage}
                hasMore={hasMore}
                loader={<Row xs={2} sm={2} md={3} lg={4} xl={5}>
                {  [1,2,3,4,5].map((count,index)=>(
         
                   <Col key={index}>
                   <Skeleton style={{aspectRatio:'16/9',height:'10rem'}} count={1}/>
                   </Col>
                  )) 
                  
                }
                  </Row>}
               endMessage={
                    !loading &&
                    <p  className='text-white text-center my-4' >
                    <Button variant='transparent' className='trailer-btn' onClick={()=>window.scrollTo(0,0)}>Scroll To Top <FaArrowUp className='mb-1'/> </Button>
                                        
                </p>
                }
            >
            {renderContent()}
            </InfiniteScroll>
}
        </section>
    );
}

export default AllShorts;
