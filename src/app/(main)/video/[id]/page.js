import React from "react";
import VideoPage from "@/client-pages/VideoPage";

function page({ params }) {
  const id = params.id;
  return <VideoPage id={id} />;
}

export default page;
