"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import "./ShortsPlayer.css";
import { imgAddr, useGetShortsByIdMutation, vidAddr } from "../features/api";
import ShortsVideoPlayer from "./ShortsVideoPlayer";
import { IoMdArrowRoundBack } from "react-icons/io";
import Skeleton from "react-loading-skeleton";

import { useRouter } from "next/navigation";

function ShortsPlayer({ id }) {
  const [getShortsById, { isLoading }] = useGetShortsByIdMutation();

  const router = useRouter();
  const containerRef = useRef(null);
  const playerRefs = useRef([]);
  const progressRefs = useRef([]);

  const [index, setIndex] = useState(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const activeVideoIndexRef = useRef(activeVideoIndex);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [shortsData, setShortsData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [totalShorts, setTotalShorts] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    playerRefs.current = playerRefs.current.slice(0, shortsData.length);
  }, [shortsData]);

  // index + rpp > video.length;

  //  slice(index,video.length)

  const getShorts = async () => {
    try {
      const params = `?currentPage=${currentPage}&resultPerPage=4${
        index !== null && index !== undefined ? `&index=${index}` : ""
      }`;

      // console.log(id,params);
      const data = await getShortsById({ id, params }).unwrap();
      // console.log(data);
      setIndex(data?.index);
      if (currentPage === 1) {
        setShortsData(data?.shorts);
      } else {
        setShortsData((prevShortsData) => [...prevShortsData, ...data?.shorts]);
      }

      setTotalShorts(data?.shortsCount);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMore(shortsData?.length < totalShorts);
  }, [totalShorts, shortsData]);
  useEffect(() => {
    getShorts();
  }, [id, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index"));
            setActiveVideoIndex(index);
            if (!isLoading && index === shortsData?.length - 2 && hasMore) {
              setCurrentPage((prev) => prev + 1);
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    const videoElements = Array.from(containerRef.current.children);
    videoElements.forEach((video, index) => {
      observer.observe(video);
    });

    return () => {
      observer.disconnect();
    };
  }, [shortsData]);

  useEffect(() => {
    console.log(activeVideoIndex);
  }, [activeVideoIndex]);

  return (
    <div
      className="shorts-container"
      ref={containerRef}
      style={{ scrollSnapType: "y mandatory" }}
    >
      <u className="back-btn text-white " onClick={() => router.back()}>
        <IoMdArrowRoundBack />
        Back
      </u>

      {!loading ? (
        shortsData?.length > 0 &&
        shortsData?.map((short, index) => (
          <div
            key={index}
            style={{ scrollSnapAlign: "start" }}
            className={`shorts-player p-md-3 p-0 ${
              index === activeVideoIndex ? "active" : ""
            }`}
            data-index={index}
          >
            <ShortsVideoPlayer
              index={index}
              nickName={short?.nick_name}
              activeVideoIndex={activeVideoIndex}
              id={short?._id}
              videoUrl={short?.video_url}
              thumbnail={short?.thumbnail_url}
              longVideoUrl={short?.long_video_url}
              title={short?.title}
            />
          </div>
        ))
      ) : (
        <div
          className="text-center py-md-4"
          style={{ height: "100vh", width: "100%" }}
        >
          <Skeleton
            className="rounded-4"
            style={{ aspectRatio: "9/16", height: "100%", width: "auto" }}
            count={1}
          />
        </div>
      )}
    </div>
  );
}

export default ShortsPlayer;
