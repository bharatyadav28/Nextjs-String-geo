"use client";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { setInitialAuth } from "@/features/authSlice";

function Loader() {
  const { loading } = useSelector((state) => state.loading);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const initialState = {
      user: localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
      accessToken: localStorage.getItem("accessToken")
        ? JSON.parse(localStorage.getItem("accessToken"))
        : null,
      refreshToken: localStorage.getItem("refreshToken")
        ? JSON.parse(localStorage.getItem("refreshToken"))
        : null,
      isActivePlan: localStorage.getItem("isActivePlan")
        ? JSON.parse(localStorage.getItem("isActivePlan"))
        : null,
      watchlist: localStorage.getItem("watchlist")
        ? JSON.parse(localStorage.getItem("watchlist"))
        : null,
    };
    dispatch(setInitialAuth(initialState));
  }, []);

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
