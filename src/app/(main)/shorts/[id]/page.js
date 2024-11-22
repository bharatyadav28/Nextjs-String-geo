import React from "react";
import ShortsPlayer from "@/components/ShortsPlayer";

function page({ params }) {
  const id = params.id;
  return <ShortsPlayer id={id} />;
}

export default page;
