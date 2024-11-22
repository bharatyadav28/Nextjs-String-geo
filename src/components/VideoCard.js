import React, { useEffect, useState } from "react";
import "./VideoCard.css";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import { BsFillPlayCircleFill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice";
import Skeleton from "react-loading-skeleton";
import {
  imgAddr,
  useAddToWatchlistMutation,
  useRemoveFromWatchlistMutation,
} from "../features/api";
import { getError } from "../utils/error";
import { useRouter, usePathname } from "next/navigation";

function VideoCard({ video, loading = false }) {
  const [added, setAdded] = useState(video?.inWatchList);
  const { accessToken, user, isActivePlan } = useSelector(selectAuth);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [removeFromWatchlist] = useRemoveFromWatchlistMutation();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isFreeSection = pathname.includes("free-trail");

  const hasAccess = accessToken && isActivePlan;
  const desclength = isTouchDevice ? 50 : 80;

  const thumbnail = `${imgAddr}/${video?.thumbnail_url}`;

  const handleWatchlistToggler = async () => {
    try {
      setIsLoading(true);
      if (added) {
        const data = await removeFromWatchlist({
          videoId: video?._id,
        }).unwrap();
        setAdded(false);
      } else {
        const data = await addToWatchlist({ videoId: video?._id }).unwrap();
        setAdded(true);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      getError(error);
    }
  };

  const handleViewVideo = () => {
    //  if(isFreeSection){
    //   navigate(`/free-video/${video?.nick_name || video?._id}`);
    //   }
    //   else if(video?.access==='free' || isActivePlan){

    //     navigate(`/video/${video?.nick_name || video?._id}`);
    //   }else{
    //     if( !isActivePlan && accessToken){

    //       navigate('/auth/billing');
    //     }else{
    //       navigate(`/video/${video?.nick_name || video?._id}`);
    //     }
    //   }

    if (isFreeSection) {
      router.push(`/free-video/${video?.nick_name || video?._id}`);
    } else {
      router.push(`/video/${video?.nick_name || video?._id}`);
    }
  };

  useEffect(() => {
    const onTouchStart = () => {
      setIsTouchDevice(true);
    };

    if ("ontouchstart" in window || navigator.maxTouchPoints) {
      setIsTouchDevice(true);
    }

    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, []);

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <Card
      className={`${
        isTouchDevice ? "video-Card-touch" : "video-card"
      } border-0 bg-dark rounded-4 p-0 `}
      // style={{backgroundImage:`url(${thumbnailUrl})`,backgroundSize:'100% 100%',backgroundRepeat:'no-repeat'}}
    >
      {loading ? (
        <Skeleton height={"10rem"} />
      ) : (
        <>
          <Image
            loading="lazy"
            src={thumbnail}
            alt={video?.title}
            className={`${isTouchDevice ? "thumbnail-touch" : "thumbnail"}`}
            onClick={handleViewVideo}
          />

          <div
            className={`${
              isTouchDevice ? "video-touch-info" : "video-info"
            } p-2`}
          >
            <Row className="card-btn m-0 ">
              <Col className="p-0">
                <Button
                  variant="transparent"
                  // size="lg"
                  className="text-white  mx-md-2  mx-1   fw-bold form-btn text-nowrap watch-now"
                  onClick={handleViewVideo}
                  style={{ fontSize: "0.8rem" }}
                >
                  <BsFillPlayCircleFill className="mb-1" /> Watch Now
                </Button>
                {/* <Button
              variant="transparent"
              // size="lg"
              className=" p-0 m-1 pb-0 fw-bold text-center rounded-pill text-nowrap watch-now"
              onClick={handleViewVideo}
              // style={{ fontSize: "0.8rem" }}
            >
              <BsFillPlayCircleFill size={35}  className="" /> 
            </Button> */}
                {accessToken && !isFreeSection ? (
                  <Button
                    variant="secondary"
                    // size="lg"
                    className="p-1 add-btn"
                    onClick={() => handleWatchlistToggler()}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Spinner size="sm" />
                    ) : added ? (
                      <FaCheck className="mb-0 mx-1" />
                    ) : (
                      <FaPlus className="mb-0 mx-1" />
                    )}
                  </Button>
                ) : null}
              </Col>
            </Row>
            <Row className="m-0 p-0">
              <Col
                className={`${
                  isTouchDevice ? "touch-info" : "info"
                } px-md pt-2`}
              >
                <p className="title m-0">{video?.title}</p>
                <p className="tags m-0" style={{ fontSize: "0.65rem" }}>
                  {video?.genres?.length > 0 && `${video?.genres[0]?.name} | `}
                  {video?.createdAt &&
                    `${new Date(video?.createdAt).toLocaleDateString(
                      "en-GB"
                    )} | `}
                  {video?.language?.length > 0 && video?.language[0]?.name}
                </p>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Card>
  );
}

export default VideoCard;
