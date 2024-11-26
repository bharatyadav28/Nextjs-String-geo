import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import VideoCard from "../components/VideoCard";
import ShortsCard from "../components/ShortsCard";
import { useGetFreeVideosMutation } from "../features/api";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import ScrollToTop from "../components/ScrollToTop";
import { FaAngleRight, FaArrowUp } from "react-icons/fa6";

import Link from "next/link";

function FreeContent() {
  const [getFreeVideos, {}] = useGetFreeVideosMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [videoData, setVideoData] = useState([]);
  const [shortsData, setShortsData] = useState([]);
  const [newVideoData, setNewVideoData] = useState([]);
  const [newShortsData, setNewShortsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalVideoCount, setTotalVideoCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [contentData, setContentData] = useState([]);

  const fetchFreeVideos = async () => {
    try {
      const parameters = `?&currentPage=${currentPage}`;
      const data = await getFreeVideos(parameters).unwrap();
      const newData = [];
      newData[0] = data?.shorts;
      newData[1] = data?.full_length_videos;

      // setContentData(prev => [...prev, newData]);
      if (currentPage === 1) {
        setVideoData(data?.full_length_videos);
        setShortsData(data?.shorts);
        setNewVideoData(data?.full_length_videos);
        setNewShortsData(data?.shorts);
        setContentData([newData]);
      } else {
        setContentData((prev) => [...prev, newData]);
        setNewVideoData(data?.full_length_videos);
        setNewShortsData(data?.shorts);
        setVideoData((prev) => [...prev, ...data?.full_length_videos]);
        setShortsData((prev) => [...prev, ...data?.shorts]);
      }

      setTotalVideoCount(data?.totalVideoCount);

      // console.log(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFreeVideos();
  }, [currentPage]);

  useEffect(() => {
    setDataLength(videoData?.length + shortsData?.length);
    setHasMore(totalVideoCount > videoData?.length + shortsData?.length);
  }, [totalVideoCount, videoData, shortsData]);

  const bg = "bg/homecontent.svg";

  const handleNextPage = () => {
    // console.log(videoData?.length, shortsData?.length, totalVideoCount)
    if (!loading && videoData?.length + shortsData?.length < totalVideoCount) {
      // setLoading(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const renderContent = () => {
    return (
      contentData &&
      contentData?.map((dataSet, index) => (
        <React.Fragment key={index}>
          {dataSet[0].length > 0 && (
            <Row className="text-white ms-md-4 mt-4">
              <Col>
                <h3>Shorts</h3>
              </Col>
              <Col xs={4} className="text-end">
                <Link
                  href={"/free-trail/all-shorts"}
                  style={{ color: "white" }}
                >
                  View All <FaAngleRight />
                </Link>
              </Col>
            </Row>
          )}
          <Row xs={2} sm={3} md={3} lg={6} xl={6} className="mx-md-4 ">
            {dataSet[0] &&
              dataSet[0]?.map((short, shortIndex) => (
                <Col
                  key={short?._id}
                  className="m p-2 d-flex align-items-center justify-content-center"
                >
                  <ShortsCard short={short} />
                </Col>
              ))}
          </Row>
          {dataSet[1].length > 0 && (
            <h3 className="text-white ms-md-4 mt-4">Trailers</h3>
          )}
          <Row xs={2} sm={3} md={3} lg={4} xl={5} className="mx-md-4 ">
            {dataSet[1] &&
              dataSet[1]?.map((video, videoIndex) => (
                <Col
                  key={video?._id}
                  className="p-1 d-flex align-items-center justify-content-center"
                >
                  <VideoCard video={video} />
                </Col>
              ))}
          </Row>
        </React.Fragment>
      ))
    );
  };
  return (
    <section
      className=" full-section"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <ScrollToTop />
      {loading ? (
        <>
          <Skeleton width={"20%"} height={"1.5rem"} className="mt-5" />
          <Row xs={2} sm={3} md={3} lg={6} xl={6} className="mx-md-4 ">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <Col key={i}>
                <Skeleton
                  style={{ aspectRatio: "9/16", height: "20rem" }}
                  count={1}
                />
              </Col>
            ))}
          </Row>

          <Skeleton width={"20%"} height={"1.5rem"} className="mt-5" />
          <Row xs={2} sm={3} md={3} lg={6} xl={6} className="mx-md-4 ">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <Col key={i}>
                <Skeleton
                  style={{ aspectRatio: "16/9", height: "10rem" }}
                  count={1}
                />
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <InfiniteScroll
          // style={{marginBottom:'4rem'}}
          className="free-section px-3"
          dataLength={dataLength}
          next={handleNextPage}
          hasMore={hasMore}
          loader={
            <Row xs={2} sm={2} md={3} lg={4} xl={5}>
              {[1, 2, 3, 4, 5].map((count, index) => (
                <Col key={index}>
                  <Skeleton
                    style={{ aspectRatio: "16/9", height: "10rem" }}
                    count={1}
                  />
                </Col>
              ))}
            </Row>
          }
          endMessage={
            !loading && (
              <p className="text-white text-center my-4">
                <Button
                  variant="transparent"
                  className="trailer-btn"
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Scroll To Top <FaArrowUp className="mb-1" />{" "}
                </Button>
              </p>
            )
          }
        >
          {renderContent()}
        </InfiniteScroll>
      )}
    </section>
  );
}

export default FreeContent;
