"use client";

import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row, Spinner } from "react-bootstrap";
import { PiShareFatLight } from "react-icons/pi";
import {
  baseAddr,
  imgAddr,
  useGetFreeVideoByIdMutation,
  useGetShareImageMutation,
  useGetVideoByIdMutation,
  useGetVideoPreviewMutation,
} from "../features/api.js";
import Skeleton from "react-loading-skeleton";
import AllCategories from "../components/AllCategories.js";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice.js";
import VideoPlayer from "../components/VideoPlayer.js";
import { getError } from "../utils/error.js";
import toast from "react-hot-toast";
import "share-api-polyfill";
import axios from "axios";
import { FaPlay } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";
import "./VideoPage.css";
import { IoMdShare } from "react-icons/io";

import { useRouter, usePathname } from "next/navigation";

function VideoPage({ id }) {
  const [getVideoById, { error }] = useGetVideoByIdMutation();
  const [getVideoPreview] = useGetVideoPreviewMutation();
  const [getFreeVideoById] = useGetFreeVideoByIdMutation();
  const { accessToken, isActivePlan } = useSelector(selectAuth);
  const [notFound, setNotFound] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [getShareImage] = useGetShareImageMutation();
  // const [getAllCategories,{isLoading}] = useGetAllCategoriesMutation();
  const [videoData, setVideoData] = useState(null);
  const [videoLoading, SetVideoLoading] = useState(false);
  const router = useRouter();
  const isMediumDevice = useMediaQuery({ maxWidth: 1000 });
  const isMobileDevice = useMediaQuery({ maxWidth: 900 });

  const pathname = usePathname();
  const isFreePage = pathname.includes("free-video");

  const fetchVideo = async () => {
    try {
      SetVideoLoading(true);
      const data = await getVideoById(id).unwrap();
      SetVideoLoading(false);
      if (data?.status === 404) {
        setNotFound(true);
      } else {
        setVideoData(data?.video);
      }
    } catch (error) {
      SetVideoLoading(false);
      console.log(error);
      if (error?.status === 404 || error?.status === 500) {
        setNotFound(true);
      }
      if (error?.status === 402) {
        router.push("/auth/billing");
      }
    }
  };
  const fetchFreeVideo = async () => {
    try {
      SetVideoLoading(true);
      const data = await getFreeVideoById(id).unwrap();
      SetVideoLoading(false);
      if (data?.status === 404) {
        setNotFound(true);
      } else {
        setVideoData(data?.video);
      }
    } catch (error) {
      SetVideoLoading(false);
      console.log(error);
      if (error?.status === 404 || error?.status === 500) {
        setNotFound(true);
      }
      if (error?.status === 402) {
        router.push("/auth/billing");
      }
    }
  };

  const fetchVideoPreview = async () => {
    try {
      SetVideoLoading(true);
      const data = await getVideoPreview(id).unwrap();
      SetVideoLoading(false);
      if (data?.status === 404) {
        setNotFound(true);
      } else {
        setVideoData(data?.video);
      }
    } catch (error) {
      SetVideoLoading(false);
      console.log(error);
      if (error?.status === 404 || error?.status === 500) {
        setNotFound(true);
      }
    }
  };

  const handleShare = async () => {
   

    const url = new URL(window.location.href);
    if (url.hostname.startsWith("www.")) {
      url.hostname = url.hostname.replace("www.", "");
    }
    const cleanUrl = url.toString();    

    try{
      await navigator.share({
        title: "Video:",
        url: cleanUrl,
      });
    }catch(error){
      console.log(error);
    }
      

  };

  useEffect(() => {
    if (id) {
      setNotFound(false);
      window.scrollTo(0, 0);
      setExpanded(false);
      if (isFreePage) {
        fetchFreeVideo();
      } else if (accessToken && isActivePlan) {
        fetchVideo();
      } else {
        fetchVideoPreview();
      }
    } else {
      router.push("/auth/billing");
    }
  }, [id]);

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  return (
    <>
      {notFound ? (
        <Container className="video-container text-white d-flex justify-content-center align-items-center p-5">
          <h1>Video not found</h1>
        </Container>
      ) : (
        <section className="">
          {videoLoading ? (
            <div className="video-container text-white d-flex justify-content-center align-items-center">
              <Spinner
                variant="border"
                style={{ height: "5rem", width: "5rem", borderWidth: "0.5rem" }}
              />
            </div>
          ) : videoData?.video_url ? (
            <div>
              <VideoPlayer
                source={videoData?.video_url}
                poster={videoData?.thumbnail_url}
              />
            </div>
          ) : videoData?.thumbnail_url ? (
            //  <div className="video-container" style={{padding:0
            // //  maxHeight:'100vh',marginTop:`${isMobileDevice?'':'-60px'}`
            //  }}>
            <div className={"d-flex justify-content-center preview-container"}>
              <div className="preview-image-wrapper">
                <Image
                  src={imgAddr + "/" + videoData?.thumbnail_url}
                  alt="Thumbnail"
                  className="preview-image"
                />
              </div>

              <div className="floating-text">
                {!isMobileDevice && (
                  <div>
                    <h3 className="fw-bold ">{videoData?.title}</h3>
                    <div
                      style={{ fontSize: "0.9rem" }}
                      dangerouslySetInnerHTML={createMarkup(
                        `${videoData?.description?.substring(0, 200)}...`
                      )}
                    />

                    <div className="text-secondary fw-semibold " >
                      <p style={{ color: "#ccc" }}>
                        {videoData?.genres
                          ?.map((genre) => genre?.name)
                          .join(" | ")}{" "}
                        |{" "}
                        {videoData?.createdAt &&
                          new Date(videoData?.createdAt).toLocaleDateString(
                            "en-GB"
                          )}{" "}
                        |{" "}
                        {videoData?.language
                          ?.map((lang) => lang?.name)
                          .join(" | ")}{" "}
                      </p>
                    </div>
                  </div>
                )}
                <div className=" text-nowrap">
                  <Button
                    size={`${
                      isMobileDevice ? "sm" : isMediumDevice ? "md" : "lg"
                    }`}
                    className="sub-to-watch-btn text-nowrap fw-bold rounded-3  py-sm-3 py-2 px-3 "
                    variant="transparent"
                    onClick={() => {
                      if (accessToken) {
                        router.push(`/auth/billing?redirectFrom=/video/${id}`);
                      } else {
                        router.push(`/auth/signin?redirectFrom=/video/${id}`);
                      }
                    }}
                  >
                    <FaPlay className="mb-1 me-2" />

                    {accessToken ? "Subscribe to Watch" : "Login to Watch"}
                  </Button>
                  
                    <Button
                      size={`${
                        isMobileDevice ? "sm" : isMediumDevice ? "md" : "lg"
                      }`}
                      className="big-share-btn text-nowrap py-sm-3 py-2 px-sm-4 px-3  ms-2 fw-bold rounded-3 "
                      variant="transparent"
                      onClick={handleShare}
                    >
                      <IoMdShare className="mb-1" size={isMobileDevice?17:24} />
                    </Button>
                  
                </div>
              </div>
            </div>
          ) : // </div>
          null}

          <Container className="text-white py-2">
            <Row>
              {videoLoading ? (
                <>
                  <Col>
                    <Skeleton width={"50%"} height={"1.5rem"} />
                    <Skeleton count={3} />
                    <Skeleton width={"25%"} />
                  </Col>
                </>
              ) : (
                <Col className="py-4">
                  {videoData?.video_url ? (
                    <h4 className="fw-bold">{videoData?.title}</h4>
                  ) : (
                    isMobileDevice && (
                      <h4 className="fw-bold">{videoData?.title}</h4>
                    )
                  )}

                  <div
                    style={{
                      maxHeight: `${expanded ? "100%" : "50px"}`,
                      transition: "all 0.3s",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{ fontSize: "0.9rem" }}
                      dangerouslySetInnerHTML={createMarkup(
                        videoData?.description
                      )}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "gray",
                      }}
                    />
                    <Button
                      onClick={() => {
                        if (expanded) {
                          window.scrollTo(0, 0);
                        }
                        setExpanded(!expanded);
                      }}
                      variant="transparent"
                      className="border rounded-pill text-nowrap text-white px-2 my-1 py-0"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {expanded ? "See Less" : "See More"}
                    </Button>
                    <div
                      style={{
                        width: "100%",
                        height: "1px",
                        backgroundColor: "gray",
                      }}
                    />
                  </div>

                  <Row>
                    <Col xs={videoData?.video_url?7:12} className="text-secondary fw-semibold">
                      {(videoData?.video_url || isMobileDevice) && (
                        <p style={{ color: "#ccc" }}>
                          {videoData?.genres
                            ?.map((genre) => genre?.name)
                            .join(" | ")}{" "}
                          |
                          {videoData?.createdAt &&
                            new Date(videoData?.createdAt).toLocaleDateString(
                              "en-GB"
                            )}{" "}
                          |
                          {videoData?.language
                            ?.map((lang) => lang?.name)
                            .join(" | ")}
                        </p>
                      )}
                    </Col>

                    {videoData?.video_url &&
                    <Col className="text-end">
                      {/* {videoData?.views} Views  */}

                      {(videoData?.video_url) && (
                        <Button
                          disabled={!videoData?.title}
                          className="rounded-pill text-nowrap mx-md-3 mx-1"
                          variant="secondary"
                          onClick={handleShare}
                        >
                          <IoMdShare className="mb-1" /> Share
                        </Button>
                      )}
                    </Col>
                    }
                  </Row>
                </Col>
              )}
            </Row>
          </Container>
        </section>
      )}

      {/* {isFreePage?
  null
: */}
      <AllCategories />
      {/* } */}
    </>
  );
}

export default VideoPage;

// function VideoPage() {
//   return (
//     <section className='full-section account-bg d-flex justify-content-center align-items-center'>
//         <Container>
//       <h1 className='text-white display-2 text-center'>Video Page, Under Construction </h1>
//       <Row>
//         <Col className='text-center'>
//         <LuConstruction size={200} color='#CAA257'/>

//         </Col>
//       </Row>
//       </Container>
//       </section>
//   )
// }

//  export default VideoPage
