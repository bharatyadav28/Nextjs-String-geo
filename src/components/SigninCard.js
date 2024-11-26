import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import FormField from "./FormField";
import { FcGoogle } from "react-icons/fc";
import GlassCard from "./GlassCard";
import { getError } from "../utils/error";
import toast from "react-hot-toast";
import {
  selectAuth,
  setAccessToken,
  setIsActivePlan,
  setRefreshToken,
  setUser,
} from "../features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../features/api";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import Link from "next/link";
function SigninCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { refreshToken, accessToken, isActivePlan } = useSelector(selectAuth);
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser, {}] = useLoginUserMutation();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  // const [mobile, setMobile] = useState(null);
  const [password, setPassword] = useState("");
  const [relogin, setRelogin] = useState(false);
  // const [loginCredentials, setLoginCredentials] = useState({

  //     email: '',
  //     mobile: '',
  //     password: '',
  //     logout_from_other_device: false,

  // });

  let loginCredentials = {
    email: "",
    // mobile:'',
    password: "",
    logout_from_other_device: false,
  };

  // const handleIdentifierChange = (e) => {
  //   const userInput = e.target.value;
  //   if (/^\d+$/.test(userInput)) {
  //     setMobile(userInput);
  //     setEmail("");
  //   } else {
  //     setEmail(userInput);
  //     setMobile(null);
  //   }
  // };

  // const location = useLocation();
  // const [searchParams] = useSearchParams();
  const searchParams = useSearchParams();

  // const redirectToPaymentPage = location.search.includes("paymentpage=true");
  const redirectToPaymentPage = searchParams.get("paymentpage") === "true";

  // const from = location.state?.from?.pathname || "/";
  const redirectFrom = searchParams.get("redirectFrom");

  const handleFormSubmit = async (e) => {
    // e.preventDefault();

    try {
      setIsLoading(true);
      const data = await loginUser(loginCredentials).unwrap();
      setIsLoading(false);

      if (data) {
        // toast.success(data?.message)
        // router.push('/auth/otp');
        //  redirectToPaymentPage? router.push('/auth/billing'): router.push(from, { replace: true })
        dispatch(setUser(data?.user));
        dispatch(setAccessToken(data?.accessToken));
        dispatch(setRefreshToken(data?.refreshToken));
        dispatch(setIsActivePlan(data?.isActivePlan));

        //  router.push(from, { replace: true });
      }
    } catch (error) {
      setIsLoading(false);
      handleLoginErrors(error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => handleGoogleLogin(codeResponse),
    onError: (error) => handleLoginErrors(error),
  });

  const handleGoogleLogin = async (user) => {
    try {
      //  Google user information
      setGoogleLoading(true);
      const googleUserInfoResponse = await axios.get(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${user?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
            Accept: `application/json`,
          },
        }
      );

      setGoogleLoading(false);

      // const { given_name, family_name, email } = googleUserInfoResponse.data;
      const { email } = googleUserInfoResponse.data;

      try {
        const data = await loginUser({
          email: email,
          google_login: true,
        }).unwrap();

        // toast.success(data?.message)
        dispatch(setUser(data?.user));
        dispatch(setAccessToken(data?.accessToken));
        dispatch(setRefreshToken(data?.refreshToken));
        dispatch(setIsActivePlan(data?.isActivePlan));

        //  router.push('/')
      } catch (loginError) {
        handleLoginErrors(loginError);
      }
    } catch (error) {
      setGoogleLoading(false);
      handleLoginErrors(error);
    }
  };

  const handleLoginErrors = (error) => {
    console.error("Error during login:", error);
    getError(error);

    if (error?.status === 429) {
      setRelogin(true);
    }
  };

  const from = searchParams.get("from");

  useEffect(() => {
    if (refreshToken) {
      if (redirectFrom) {
        if (isActivePlan) {
          router.push(redirectFrom);
        } else {
          router.push(`/auth/billing?redirectFrom=${redirectFrom}`);
        }
      } else if (from) {
        router.push(from);
      } else {
        if (redirectToPaymentPage) {
          router.push("/auth/billing");
        } else {
          router.push("/");
        }
      }
    }
  }, [
    refreshToken,
    accessToken,
    isActivePlan,
    from,
    router.push,
    redirectToPaymentPage,
  ]);

  return (
    <Row className="d-flex justify-content-center align-items-center py-1">
      <Col xl={7}>
        <GlassCard>
          <h3 className="text-white text-center ">
            Continue with your Existing Account
          </h3>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              loginCredentials = {
                email: email || undefined,
                // mobile: mobile || undefined,
                password,
              };
              handleFormSubmit();
            }}
          >
            <FormField
              label="Email"
              placeholder={"Email Id"}
              type="email"
              maxLength={50}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormField
              label="Password"
              type="password"
              placeholder={"Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="text-end mb-2">
              <Link
                href={"/auth/forgot-password-mail"}
                style={{ textDecoration: "none", color: "#CAA257" }}
              >
                Forgot password ?
              </Link>
            </div>

            {relogin && (
              <Row>
                <Col>
                  <Button
                    variant="transparent"
                    className="text-white w-100 my-2 fw-bold form-btn"
                    disabled={isLoading}
                    onClick={() => {
                      loginCredentials = {
                        email: email || undefined,
                        // mobile: mobile || undefined,
                        password,
                        logout_from_other_device: true,
                      };
                      handleFormSubmit();
                    }}
                  >
                    {isLoading ? (
                      <Spinner animation="grow" size="sm" />
                    ) : (
                      "Logout from other device"
                    )}
                  </Button>
                  <br />
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <Button
                  variant="transparent"
                  className="text-white w-100 my-2 fw-bold form-btn"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <br />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="light"
                  className="rounded display-block my-2 fw-bold w-100"
                  onClick={googleLogin}
                  disabled={googleLoading}
                >
                  <FcGoogle size={22} className="me-2" />
                  {googleLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    " Sign In With Google"
                  )}
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="transparent"
                  className="text-dark w-100 my-2 fw-bold form-btn"
                  onClick={() => router.push("/auth/signup")}
                >
                  Create An Account
                </Button>
              </Col>
            </Row>
          </Form>
        </GlassCard>
      </Col>
    </Row>
  );
}

export default SigninCard;
