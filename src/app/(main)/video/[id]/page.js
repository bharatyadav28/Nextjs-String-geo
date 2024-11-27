import React from "react";
import VideoPage from "@/client-pages/VideoPage";

export async function generateMetadata({ params }) {
  // Fetch the video data

  const response = await fetch(
    `https://api.stringgeo.com/api/video/get-video-preview/${params.id}`,
    {
      method: "GET",
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
    }
  );

  if (!response.ok) {
    return {};
  }

  const { video } = await response.json();
  // console.log("ID: ", params.id, video);

  // // Thumbnail URL Generated
  const thumbnailUrl = `https://dewv7gdonips4.cloudfront.net/${video.thumbnail_url}`;

  return {
    openGraph: {
      type: "video.other",
      title: video.title,
      // description: video.description,
      images: [
        {
          url: thumbnailUrl,
          width: 1200, // Set standard width
          height: 630, // Set standard height
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: video.title,
      description: video.title,
      images: [thumbnailUrl],
    },
  };
}

function page({ params }) {
  const id = params.id;
  return <VideoPage id={id} />;
}

export default page;
