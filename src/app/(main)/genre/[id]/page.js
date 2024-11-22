"use client";

import React, { Suspense } from "react";
import VideoCollection from "@/client-pages/VideoCollection";

function page({ params }) {
  const id = params.id;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <VideoCollection id={id} />{" "}
    </Suspense>
  );
}

export default page;
