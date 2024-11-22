import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import FormField from "./FormField";
import GlassCard from "./GlassCard";
import { getError } from "../utils/error";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { resetFormData, updateFormData } from "../features/signupSlice";
import { useResetPasswordMutation, useSendCodeMutation } from "../features/api";

import { useRouter, usePathname } from "next/navigation";

function ForgotPasswordCard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [sendCode] = useSendCodeMutation();
  const [resetPassword] = useResetPasswordMutation();
  const [isLoading, setIsLoading] = useState(false);
  const formData = useSelector((state) => state.signup);

  const isResetpage = pathname.includes("forgot-password-reset");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
    console.log(formData);
  };
  // const handleIdentifierChange = (e) => {
  //   const userInput = e.target.value;
  //   // Check if the input is a numeric string
  //   if (/^\d+$/.test(userInput)) {
  //     // If numeric, treat it as a mobile number
  //     setMobile(userInput);
  //     setEmail(""); // Clear the email if it was previously set
  //   } else {
  //     // If non-numeric, consider it an email
  //     setEmail(userInput);
  //     setMobile(null); // Clear the mobile if it was previously set
  //   }
  // };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email: formData.email,
      };
      setIsLoading(true);
      const data = await sendCode(userData).unwrap();

      setIsLoading(false);
      console.log(data);

      toast.success(data?.message);

      router.push("/auth/forgot-password-otp");
    } catch (error) {
      setIsLoading(false);
      console.error("Error during sending otp:", error);
      getError(error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };

      setIsLoading(true);
      const data = await resetPassword(userData).unwrap();

      setIsLoading(false);
      console.log(data);

      toast.success(data?.message);
      dispatch(resetFormData());
      router.push("/auth/signin");

      // Inside your authentication response handling logic
      //  dispatch(setUser(response.data.user));
      //  dispatch(setAccessToken(response.data.accessToken));
      //  dispatch(setRefreshToken(response.data.refreshToken));
      //  router.push('/')
    } catch (error) {
      setIsLoading(false);
      console.error("Error during sending otp:", error);
      getError(error);
    }
  };

  return (
    <Row className="d-flex justify-content-center align-items-center py-1">
      <Col xl={7}>
        <GlassCard>
          <h3 className="text-white text-center mb-5">
            Recover your Existing account
          </h3>
          <Form onSubmit={isResetpage ? handleResetPassword : handleSendOtp}>
            <FormField
              label="Email"
              type="text"
              name="email"
              disabled={isResetpage}
              value={formData.email}
              onChange={handleInputChange}
            />

            {isResetpage ? (
              <>
                <FormField
                  label="New Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <FormField
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </>
            ) : null}

            <Row>
              <Col>
                <Button
                  variant="transparent"
                  className="text-white w-100 my-2 mt-5 fw-bold form-btn"
                  type="submit"
                >
                  {isLoading ? (
                    <Spinner animation="border" size="sm" />
                  ) : isResetpage ? (
                    "Reset Password"
                  ) : (
                    "Send OTP"
                  )}
                </Button>
                <br />
              </Col>
            </Row>
            {/* <Row>
                  <Col>
                    <Button
                      variant="light"
                      className="rounded display-block my-2 fw-bold w-100"
                      
                    >
                      <FcGoogle size={22} className="me-2" />
                      Sign in with Google
                    </Button>
                  </Col>
                </Row>
                 */}

            {isResetpage ? null : (
              <Row>
                <Col>
                  <Button
                    variant="transparent"
                    className="text-dark w-100 my-2 fw-bold form-btn"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Back to login
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </GlassCard>
      </Col>
    </Row>
  );
}

export default ForgotPasswordCard;
