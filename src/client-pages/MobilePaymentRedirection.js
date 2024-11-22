import { useEffect } from "react";
import {
  setAccessToken,
  setIsActivePlan,
  setRefreshToken,
  setUser,
} from "../features/authSlice";
import { useDispatch } from "react-redux";
import { useGetProfileMutation } from "../features/api";
import { hideLoading, showLoading } from "../features/loadingSlice";
import { getError } from "../utils/error";

import { useRouter, useSearchParams } from "next/navigation";

const MobilePaymentRedirection = () => {
  const queryParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const [getProfile, { isLoading }] = useGetProfileMutation();

  const getAccount = async () => {
    try {
      dispatch(showLoading());
      const data = await getProfile().unwrap();
      dispatch(hideLoading());

      dispatch(setUser(data?.user));
      dispatch(setIsActivePlan(data?.isActivePlan));
      router.push("/auth/billing");
    } catch (error) {
      console.log("Error fetching profile", error);
      dispatch(hideLoading());

      getError(error);
    }
  };

  useEffect(() => {
    const accessToken = queryParams.get("accessToken");
    const refreshToken = queryParams.get("refreshToken");
    // const isActivePlan = queryParams.get('isActivePlan') === 'true';

    // const user = userString ? JSON.parse(decodeURIComponent(userString)) : null;

    // console.log('User:', user);
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    // console.log('Is Active Plan:', isActivePlan);

    if (accessToken && refreshToken) {
      // dispatch(setUser(user));
      dispatch(setAccessToken(accessToken));
      dispatch(setRefreshToken(refreshToken));
      // dispatch(setIsActivePlan(isActivePlan));
      getAccount();
    } else {
      router.push("/auth/signin");
    }
  }, [location]);

  return null;
};

export default MobilePaymentRedirection;
