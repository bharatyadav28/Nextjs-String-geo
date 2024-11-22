import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { HiOutlineMail } from "react-icons/hi";
import { Button, Col, Row, Form, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa6";
import FormField from "./FormField";
import OtpInput from "react-otp-input";
import { getError } from "../utils/error";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import toast from "react-hot-toast";
import {
  useResendCodeMutation,
  useValidateCodeMutation,
  useVerifyAccountMutation,
} from "../features/api";
import {
  setAccessToken,
  setRefreshToken,
  setUser,
} from "../features/authSlice";
import { resetFormData } from "../features/signupSlice";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

function OtpCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [otp, setOtp] = useState("");
  const [verifyAccount] = useVerifyAccountMutation();
  const [validateCode] = useValidateCodeMutation();
  const [resendCode] = useResendCodeMutation();
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(90);

  const formData = useSelector((state) => state.signup);

  const isForgotPasswordOtp = pathname.includes("forgot-password-otp");

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [counter]);

  const formatCounter = (count) => {
    const minutes = Math.floor(count / 60);
    const seconds = count % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleResendOTP = async () => {
    try {
      const data = await resendCode({
        email: formData?.email,
        forgotPassword: isForgotPasswordOtp,
      }).unwrap();
      console.log(data);
      toast.success("Otp sent");
      setCounter(90);
    } catch (error) {
      console.error("Error resending OTP:", error);
      getError(error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 5) {
      toast.error("Please enter a valid 5-digit OTP.");
      return;
    }

    try {
      const userData = {
        email: formData.email,
        code: otp,
      };
      const apiPath = isForgotPasswordOtp
        ? validateCode(userData).unwrap()
        : verifyAccount(userData).unwrap();

      setIsLoading(true);

      console.log("Otp :", otp);

      const data = await apiPath;

      setIsLoading(false);
      console.log(data);

      toast.success(data?.message);

      if (isForgotPasswordOtp) {
        router.push("/auth/forgot-password-reset");
        console.log("redirecting to forgot password");
      } else {
        dispatch(setUser(data?.user));
        dispatch(setAccessToken(data?.accessToken));
        dispatch(setRefreshToken(data?.refreshToken));
        dispatch(resetFormData());
        router.push("/auth/billing");
        console.log("redirecting to billing page");
      }

      setOtp("");
    } catch (error) {
      setIsLoading(false);
      console.error("Error during registration:", error);
      getError(error);
    }
  };

  return (
    <Row className="d-flex justify-content-center align-items-center py-1 ">
      <Col xl={7}>
        <GlassCard>
          <div className="text-center">
            <h3 className="text-white">Verify Your Account</h3>

            <Row className="d-flex justify-content-center">
              <Col
                md={2}
                className="text-center py-3  d-flex align-items-center justify-content-center"
              >
                <div
                  className=" d-flex align-items-center justify-content-center"
                  style={{
                    backgroundColor: "white",
                    borderRadius: "50%",
                    color: "#CAA257",
                    width: "45px",
                    aspectRatio: "1/1",
                  }}
                >
                  <HiOutlineMail size={25} />
                </div>
              </Col>
            </Row>
            <Form onSubmit={handleFormSubmit}>
              <h3 className="text-white ">Check Your Email</h3>
              <p>
                We sent a verification code to{" "}
                <span className="text-white">{formData?.email}</span>
              </p>

              <Row>
                <OtpInput
                  value={otp}
                  onChange={(otpValue) => setOtp(otpValue)}
                  numInputs={5}
                  //   renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                  containerStyle={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                  inputStyle={{
                    margin: "15px 5px ",
                    borderRadius: "10%",
                    // height:'60px',
                    // width:'60px',
                    width: "100%",
                    maxWidth: "60px",
                    aspectRatio: "1/1",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    background: "rgba( 0, 0, 0, 0.2 )",
                    border: "1px solid rgba( 209, 255, 255, 0.18 )",
                    backdropFilter: "blur( 0px )",
                    color: "white",
                  }}
                />
              </Row>

              <Row className="text-center d-flex justify-content-center">
                <Col>
                  <Button
                    variant="transparent"
                    className="text-white w-100 my-3 fw-bold form-btn"
                    type="submit"
                    //   onClick={()=>router.push('/auth/billing')}
                  >
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Verify Email & Proceed"
                    )}
                  </Button>
                  {counter == 0 ? (
                    <p className="text-secondary">
                      <span
                        onClick={handleResendOTP}
                        style={{ cursor: "pointer", color: "#CAA257" }}
                      >
                        click here{" "}
                      </span>
                      to resend now
                    </p>
                  ) : (
                    <p className="text-secondary">
                      Didn&apos;t receive the email? Resend OTP in{" "}
                      <span style={{ color: "#CAA257" }}>
                        {formatCounter(counter)}
                      </span>
                    </p>
                  )}
                  {isForgotPasswordOtp ? (
                    <p className="my-3">
                      <Link
                        href={"/auth/signin"}
                        style={{ textDecoration: "none", color: "#CAA257" }}
                      >
                        <FaArrowLeft /> Back To Log In
                      </Link>
                    </p>
                  ) : (
                    <p className="my-3">
                      <Link
                        href={"/auth/signup"}
                        style={{ textDecoration: "none", color: "#CAA257" }}
                      >
                        <FaArrowLeft /> Go Back
                      </Link>
                    </p>
                  )}
                </Col>
              </Row>
            </Form>
          </div>
        </GlassCard>
      </Col>
    </Row>
  );
}

export default OtpCard;
