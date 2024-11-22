"use client";

import React, { useEffect } from "react";

import AllCategories from "../components/AllCategories";
import DashHomeCarousel from "../components/DashHomeCarousel";
import MotionDiv from "../components/MotionDiv";
import "./VideoPage.css";

function DashboardHome() {
  // const [getAllCategories,{isLoading}] = useGetAllCategoriesMutation();
  // const [videoData,setVideoData]=useState(null);

  const fetchAllCategories = async () => {
    // try {
    //   const data = await getAllCategories().unwrap();
    //  console.log('data:',data);
    //   setVideoData(data?.categories);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  useEffect(() => {
    // fetchAllCategories();
  }, []);

  return (
    <>
      <section className="">
        <MotionDiv>
          <DashHomeCarousel />
        </MotionDiv>
      </section>
      <AllCategories />
    </>
  );
}

export default DashboardHome;
