import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";

import { useGetTrailerQuery } from "../features/api";
import VideoPlayer from "./VideoPlayer";
import ErrorBoundary from "../utils/ErrorBoundary";

function HomeTrailer() {
  const {data,error} = useGetTrailerQuery();
  const [videoData,setVideoData] = useState([]);


  useEffect(()=>{
     setVideoData(data?.trailers);
    
  },[data])

  return (
    <section
      className="d-flex justify-content-center align-items-center"
      
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), linear-gradient(to left, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(bg/trailercollage.png)`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "600px",
        backgroundAttachment:'fixed',
        
      }}
    >
      <Container className="px-lg-5 ">
        <Row>
          <Col className={` text-white nexa-heavy`}
          style={{wordSpacing:'0.2rem'}}
          >
            <h1 className="display-2 " style={{letterSpacing:'0.2rem'}}>INFORMATION</h1>
            <h3>THAT IS NOT AVAILABLE ANYWHERE</h3>
          </Col>
        </Row>
        <Row className=" ">
          <Col md={6}
          className="d-flex align-items-center justify-content-center"
          >
            <Image loading="lazy" src="images/devices.png" fluid />
          </Col>
          <Col className="d-flex align-items-end justify-content-center "         

          >
          <div className=" w-100 h-100 mb-2 rounded-4 overflow-hidden d-flex  ">
            {
              videoData?.length > 0 && (
              
                  <VideoPlayer
                    poster={videoData[0]?.thumbnail_url}
                    source={videoData[0]?.video_url}
                    tooltipView={false}
                  />
               
              )
            }
            </div>

          </Col>
       
        </Row>
      </Container>
    </section>
  );
}



export default HomeTrailer;
