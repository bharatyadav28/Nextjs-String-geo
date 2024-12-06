import React, { useEffect, useRef, useState } from "react";
import { baseAddr, imgAddr, vidAddr } from "../features/api";
import ReactPlayer from "react-player";
import { FaPause, FaPlay } from "react-icons/fa6";
import { Button, Spinner } from "react-bootstrap";
import { IoMdShare } from "react-icons/io";
import hlsQualitySelector from "videojs-hls-quality-selector";
import axios from "axios";

import { useRouter } from "next/navigation";

function ShortsVideoPlayer({
  id,
  nickName,
  index,
  activeVideoIndex,
  videoUrl,
  thumbnail,
  longVideoUrl,
  title = "lorem ipsum lore uais imkjiou yyg rrdfy ogh vgr es3 hoppp",
}) {
  const router = useRouter();
  const playerRef = useRef();

  const progressRef = useRef();
  const [loading, setLoading] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [oneLiner, setOneLiner] = useState(true);

  const [vidUrl, setVidUrl] = useState(null);

  useEffect(() => {
    setVidUrl(`${vidAddr}/${videoUrl[0]?.value}/720p9x16-720p.m3u8`);
    // setVidUrl(`${imgAddr}/free-videos/${videoUrl}`);
    // setVidUrl(`https://d2n9feutzfz8ux.cloudfront.net/2132/720p9x16-720p.m3u8`);
  }, [videoUrl]);

  useEffect(() => {
    const player = playerRef.current;
    if (player && typeof player.play === "function") {
      try {
        player.seekTo(0);
        console.log("hello");
      } catch (error) {
        console.error("Error playing video: ", error);
      }
    }
  }, [activeVideoIndex]);

  const handleBuffer = () => {
    setLoading(true);
  };

  const handleBufferEnd = () => {
    setLoading(false);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
      }
      setPlaying(index === activeVideoIndex);
    }, 500);
  }, [index, activeVideoIndex]);

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const handleProgress = (state) => {
    if (!progressRef.current) return;
    const { played, playedSeconds, loaded } = state;

    const progressPercentage = played * 100;
    const loadedPercentage = loaded * 100;

    setPlayed(progressPercentage);

    setCurrentTime(playedSeconds);

    const progressBar = progressRef.current;
    if (progressBar) {
      const progressColor = `linear-gradient(to right, #CAA257 ${
        progressPercentage + 0.1
      }%, rgba(255,255,255,0.6) ${progressPercentage}%, rgba(255,255,255,0.6) ${loadedPercentage}%, rgba(255,255,255,0.2) ${loadedPercentage}%)`;
      progressBar.style.background = progressColor;
    }
  };

  const handleShare = async () => {
   
    const baseUrl = window.location.href.split("/").slice(0, -1).join("/");
    const sharedUrl = new URL(`${baseUrl}/${nickName || id}`);
    if (sharedUrl.hostname.startsWith("www.")) {
      sharedUrl.hostname = sharedUrl.hostname.replace("www.", "");
    }

    const cleanUrl = sharedUrl.toString();
   
    try{
      await navigator.share({
        title: "Video:",
        url: cleanUrl,
      });
    }catch(error){

      console.error("Error sharing:", error);
    }
      
    
  };

  return (
    <div className={`shorts-div p-0`} onClick={togglePlayPause}>
      <ReactPlayer
        controls={false}
        ref={playerRef}
        // playsinline={true}
        onProgress={handleProgress}
        // url={`https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8`}
        // url={`https://d2n9feutzfz8ux.cloudfront.net/4f43106c4a484ed7c9d96c288746b6f0-/360p.m3u8`}
        url={vidUrl}
        playing={playing}
        volume={1}
        loop
        onBuffer={handleBuffer}
        onBufferEnd={handleBufferEnd}
        config={{
          hls: {
            forceHLS: true,
            debug: true,
          },
        }}
      />

      <Button
        variant="transparent"
        className="play-pause-btn semi-trans"
        onClick={togglePlayPause}
      >
        {playing ? <FaPause size={25} /> : <FaPlay size={20} />}
      </Button>

      {longVideoUrl ? (
        <Button
          variant="transparent"
          className="full-vid-btn  p-1"
          onClick={() => router.push(longVideoUrl)}
        >
          <FaPlay className="mb-1" size={18} />
          Watch Full Video
        </Button>
      ) : null}

      <Button
        disabled={!title}
        className=" share-btn semi-trans"
        variant="transparent"
        onClick={handleShare}
      >
        <IoMdShare size={25} /> <br />{" "}
        <span style={{ fontSize: "0.75rem" }}>Share</span>{" "}
      </Button>

      <div className="shorts-controls">
        <span className="shorts-title-container p-1">
          <p
            className={`shorts-title m-0 p-1 text-white ${
              expanded ? "expanded" : ""
            }`}
          >
            {title?.substring(0, 50)}
          </p>

          {/* { !oneLiner &&  <u  className='p-0 float-end m-0 read-more-button text-white' onClick={toggleExpansion}>
             {expanded?'Read Less': 'Read More'}
            </u>
} */}
        </span>
        <input
          type="range"
          className="shorts-track"
          ref={progressRef}
          min={0}
          max={100}
          value={played}
          step="any"
        />
      </div>

      {loading ? (
        <Spinner
          animation="border"
          className="shorts-loading"
          size="lg"
          style={{ color: "#ddd" }}
        />
      ) : null}
    </div>
  );
}

export default ShortsVideoPlayer;
