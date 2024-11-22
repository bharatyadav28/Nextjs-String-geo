import { clearAuth } from "../features/authSlice";
import toast from "react-hot-toast";
import { getError } from "./error";
import { hideLoading, showLoading } from "../features/loadingSlice";
import { scroller } from "react-scroll";
import Cookies from "js-cookie";

// const dispatch = useDispatch();

export const clickSubBtn = (navigate) => {
  const packageSectionId = "home-packages";
  const offset = 0;

  const packageSection = document.getElementById(packageSectionId);
  if (packageSection) {
    scroller.scrollTo(packageSectionId, {
      smooth: true,
      duration: 500,
      offset,
    });
  } else {
    if (navigate) {
      navigate("/");
      setTimeout(() => {
        scroller.scrollTo(packageSectionId, {
          smooth: true,
          duration: 500,
          offset,
        });
      }, 1000);
    } else {
      console.error("Navigation function not provided.");
    }
  }
};

export const handleLogout = async ({
  dispatch,
  refreshToken,
  navigate,
  logoutUser,
}) => {
  try {
    dispatch(showLoading());
    const response = await logoutUser({
      refreshToken,
    }).unwrap();
    dispatch(hideLoading());
    console.log(response);

    // navigate('/', { replace: true });
    dispatch(clearAuth());
    // navigate('/')

    // toast.success('See you soon!')

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    setTimeout(() => {
      navigate("/", { replace: true, state: {} });
    }, 500);
  } catch (error) {
    dispatch(hideLoading());
    console.log("Error logout", error);
    getError(error);
  }
};
