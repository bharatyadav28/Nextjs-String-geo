import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import VideoCard from "../../components/VideoCard";
import {
  FaArrowLeftLong,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";
import { useGetWatchlistMutation } from "../../features/api";
import Skeleton from "react-loading-skeleton";

function Watchlist() {
  const [getWatchlist, { isLoading }] = useGetWatchlistMutation();

  const [videoData, setVideoData] = useState([]);

  const [viewAll, setViewAll] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist().unwrap();
      setVideoData(data?.watch_list);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  return (
    <section className="p-3  account-bg full-section ">
      <h3 className="text-white text-center fw-bold">My Watchlist</h3>
      {/* <Link to={-1} className='text-white'> <FaArrowLeftLong/> Go back </Link> */}
      {/* <Row>
        <Col className='text-end'>
        <Button variant='tranparent' className='text-secondary mx-5' onClick={()=>setViewAll(true)}>
             {viewAll?<>Collapse <FaChevronLeft/></>:<>View All <FaChevronRight/> </>}  
            {viewAll?null:<>View All <FaChevronRight/> </>} 
            
            </Button>

        </Col>
       </Row> */}
      {isLoading ? (
        <Row
          xs={2}
          sm={2}
          md={3}
          lg={4}
          xl={5}
          className="mx-md-4 mx-1 mt-5 video-mapper "
        >
          <Skeleton height={"10rem"} width={"18rem"} count={2} />
          <Skeleton height={"10rem"} width={"18rem"} count={2} />
          <Skeleton height={"10rem"} width={"18rem"} count={2} />
          <Skeleton height={"10rem"} width={"18rem"} count={2} />
          <Skeleton height={"10rem"} width={"18rem"} count={2} />
        </Row>
      ) : videoData?.length > 0 ? (
        <Row
          xs={2}
          sm={2}
          md={3}
          lg={4}
          xl={5}
          className="mx-md-4 mx-1 mt-5 video-mapper "
        >
          {/* { videoData?.slice(0, !viewAll ? 5 : videoData?.length).map((data,index) => ( */}
          {videoData?.map((video) => (
            <Col key={video?._id} className="my-2">
              <VideoCard video={video} loading={isLoading} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row>
          <Col className="text-white text-center">
            <p>Nothing in watchlist</p>
          </Col>
        </Row>
      )}
    </section>
  );
}

export default Watchlist;
