import React, { useEffect, useState } from "react";
import { Button, Carousel, Col, Image, Row } from "react-bootstrap";
import { imgAddr, useGetInnerCarouselQuery } from "../features/api";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice";
import Skeleton from "react-loading-skeleton";
import { IoPlayCircleOutline } from "react-icons/io5";
import "./DashHomeCarousel.css";
import { FaPlay } from "react-icons/fa";

import { useRouter } from "next/navigation";

function DashHomeCarousel() {
  const { data, isLoading } = useGetInnerCarouselQuery();
  const [poster, setPoster] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { accessToken, isActivePlan } = useSelector(selectAuth);
  const router = useRouter();
  const isMediumDevice = useMediaQuery({ maxWidth: 1000 });
  const isMobileDevice = useMediaQuery({ maxWidth: 900 });
  const hasAccess = accessToken && isActivePlan;

  useEffect(() => {
    setPoster(data?.carousels);
  }, [data]);

  const handleViewVideo = (item) => {
    if (item?.video_id?._id) {
      router.push(`/video/${item?.video_id?._id}`);
    } else if (item?.free_video_id?._id) {
      router.push(`/free-video/${item?.free_video_id?._id}`);
    } else {
      router.push("/auth/billing");
    }
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <section>
      {isLoading ? (
        <Skeleton
          style={{
            height: "100%",
            width: "100%",
            aspectRatio: "16/9",
            maxHeight: "100vh",
          }}
        />
      ) : (
        poster?.length > 0 && (
          <div className="carousel-section inner-carousel">
            {/* Carousel Section */}
            <Carousel
              controls={!isMobileDevice}
              indicators={true}
              pause={false}
              // interval={1000000}
              style={{ height: "100%" }}
              onSelect={handleSelect}
            >
              {poster?.map((item, index) => (
                <Carousel.Item className="" key={index}>
                  <div
                    className="d-flex  justify-content-center preview-container"
                    style={{ marginTop: 0 }}
                  >
                    <div className="preview-image-wrapper">
                      <Image
                        src={`${imgAddr}/${item?.poster_url}`}
                        alt="Thumbnail"
                        className="preview-image"
                        // style={{marginLeft:'calc(100vh - 60px)'}}
                      />
                    </div>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>

            {(poster?.[activeIndex]?.video_id?.title ||
              poster?.[activeIndex]?.free_video_id?.title) && (
              <div className={`floating-carousel-text p-2`}>
                <h3 className="text-white hero-title">
                  {poster?.[activeIndex]?.video_id?.title ||
                    poster?.[activeIndex]?.free_video_id?.title ||
                    "Video"}
                </h3>

                <div className="watch-now-btn-div">
                  <Button
                    variant="transparent"
                    className="px-md-5 py-md-3 px-3 py-2 text-nowrap  sub-to-watch-btn rounded-3"
                    onClick={() => handleViewVideo(poster?.[activeIndex])}
                    size={`${
                      isMobileDevice ? "sm" : isMediumDevice ? "md" : "lg"
                    }`}
                  >
                    <FaPlay className="mb-1 me-2" />
                    Watch Now
                    {/* <IoPlayCircleOutline size={25}/> */}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </section>
  );
}

export default DashHomeCarousel;
