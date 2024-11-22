import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import VideoCard from "./VideoCard";
import {
  useGetAllCategoriesMutation,
  useGetAllCategoriesNoauthMutation,
} from "../features/api";
import Skeleton from "react-loading-skeleton";
import { FaAngleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice";

import Link from "next/link";

function AllCategories() {
  const [getAllCategories, { data, error, isLoading }] =
    useGetAllCategoriesMutation();
  const [
    getAllCategoriesNoauth,
    { data: noauthData, isLoading: noauthLoading },
  ] = useGetAllCategoriesNoauthMutation();
  const { accessToken } = useSelector(selectAuth);
  // const {data} = useGetAllCategoriesQuery();
  const [videoData, setVideoData] = useState(null);

  // const fetchAllCategories = async()=>{
  //   try {
  //     const data = await getAllCategories().unwrap();
  //    console.log('data:',data);
  //     setVideoData(data?.categories);

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    if (accessToken) {
      getAllCategories();
    } else {
      getAllCategoriesNoauth();
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      setVideoData(data?.categories);
    } else {
      setVideoData(noauthData?.categories);
    }
  }, [data, noauthData]);

  return (
    <section className="py-md-5 py-3 category-section">
      <Container>
        {/* <h4 style={{ color: "#CAA257" }} className=" ms-5 mt-5 ">
        <BsStars /> Continue Watching
      </h4> */}

        {/* <h4 style={{ color: "#CAA257" }} className=" ms-5 mt-5 ">
        <BsStars /> You May also like
      </h4> */}

        {isLoading ? (
          <>
            <Skeleton width={"25%"} height={"1rem"} />
            <Skeleton count={2} height={"15rem"} />
          </>
        ) : (
          videoData?.map((category, index) => (
            <div key={category?._id}>
              <Row className="mx-md-5 px-md-5 mt-4 pb-2 pb-md-0">
                <Col>
                  <h3 className="text-white fw-bold d-inline">
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
          ))
        )}
      </Container>
    </section>
  );
}

export default AllCategories;
