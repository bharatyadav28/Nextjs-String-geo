import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VideoCard from "./VideoCard";
import { useGetRecentPopularCategoriesMutation } from "../features/api";
import { FaAngleRight } from "react-icons/fa";

import Link from "next/link";

function HomeContent() {
  const [getRecentPopularCategories, { isLoading }] =
    useGetRecentPopularCategoriesMutation();
  const [videoData, setVideoData] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getRecentPopularCategories().unwrap();
      setVideoData(data?.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section
      className="py-md-5 category-section"
      style={{
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Container>
        {/* <h4 style={{ color: "#CAA257" }} className=" ms-5 mt-5 ">
        <BsStars /> Continue Watching
      </h4> */}

        {videoData?.map((category, index) => (
          <div key={category?._id}>
            <Row className="mx-md-5 px-md-5 pt-3  pb-2 pb-md-0">
              <Col>
                <h3 className="text-white d-inline fw-bold">
                  {category?.name}
                </h3>
                <Link
                  href={`/search?category=${category?._id}`}
                  className="float-end text-white"
                >
                  See More <FaAngleRight />
                </Link>
              </Col>
            </Row>
            <Row xs={2} md={3} className="mx-md-5 px-lg-5 videos-mapper">
              {category?.video_array?.map((data, index) => (
                <Col
                  key={data?.video?._id}
                  className="p-md-4 d-flex p-1 align-items-center justify-content-center"
                >
                  <VideoCard video={data?.video} loading={isLoading} />
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Container>
    </section>
  );
}

export default HomeContent;
