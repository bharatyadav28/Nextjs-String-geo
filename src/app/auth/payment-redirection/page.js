"use client";

import React, { Suspense } from "react";
import MobilePaymentRedirection from "@/client-pages/MobilePaymentRedirection";

function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {" "}
      <MobilePaymentRedirection />{" "}
    </Suspense>
  );
}

export default page;
