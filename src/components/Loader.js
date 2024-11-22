"use client";
import React from "react";
import { useSelector } from "react-redux";

function Loader() {
  const { loading } = useSelector((state) => state.loading);

  console.log("Loading....");

  return (
    <>
      {loading && (
        <div className="spinner-parent">
          <div className=" spinner-grow" role="status"></div>
        </div>
      )}
    </>
  );
}

export default Loader;
