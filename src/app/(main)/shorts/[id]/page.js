import React from "react";
import ShortsPlayer from "@/components/ShortsPlayer";

export async function generateMetadata({ params }) {
  // Fetch the video data
  const rVideo = await fetch(
    `https://api.stringgeo.com/api/free-video/get-shorts/${params.id}?currentPage=1&resultPerPage=4
`
  );

  const { shorts } = await rVideo.json();

  const video = shorts?.find((short) => short?._id === params.id);

  console.log("video:", video);

  // Thumbnail URL Generated
  const thumbnailUrl = `https://dewv7gdonips4.cloudfront.net/${video.thumbnail_url}`;

  return {
    openGraph: {
      type: "video.other",
      title: video.title,
      description: video.description,
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
      description: video.description,
      images: [thumbnailUrl],
    },
  };
}

function page({ params }) {
  const id = params.id;
  return <ShortsPlayer id={id} />;
}

export default page;
