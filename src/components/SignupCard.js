import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import FormField from "./FormField";
import { getError } from "../utils/error.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateFormData } from "../features/signupSlice.js";
import { useSignupUserMutation } from "../features/api.js";
// import AutocompleteInput from './GeoLocation.js'
import { selectAuth } from "../features/authSlice.js";
import { City, Country, State } from "country-state-city";
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumber } from "libphonenumber-js";

import { useRouter } from "next/navigation";
import Link from "next/link";

function SignupCard() {
  const { refreshToken } = useSelector(selectAuth);
  const router = useRouter();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.signup);
  const [signupUser, { isLoading }] = useSignupUserMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateFormData({ [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (formData?.mobile) {
      const phoneNumber = parsePhoneNumber(
        formData?.mobile?.replace(formData?.dialCode, ""),
        formData?.countryCode?.toUpperCase()
      );
      if (phoneNumber && phoneNumber.isValid()) {
        try {
          const data = await signupUser({
            email: formData.email,
            name: formData.name,
            mobile: formData.mobile,
            country: formData.country,
            states: formData.states,
            city: formData.city,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            country_code: formData.countryCode,
          }).unwrap();

          toast.success(data?.message);
          router.push("/auth/otp");
          dispatch(
            updateFormData({
              // email: "",
              password: "",
              confirmPassword: "",
            })
          );
        } catch (error) {
          console.error("Error during registration:", error);
          getError(error);
        }
      } else {
        toast.error("Enter a valid mobile number");
      }
    } else {
      toast.error("Enter Mobile number");
    }
  };

  useEffect(() => {
    refreshToken && router.push("/");
  }, [refreshToken]);

  return (
    <GlassCard>
      <h3 className="text-center text-white ">Create New Account</h3>
      <Form onSubmit={handleFormSubmit}>
        <Row>
          <Col>
            <FormField
              label="Full Name"
              type="text"
              placeholder="Full Name"
              name="name"
              value={formData.name}
              maxLength={25}
              onChange={handleInputChange}
            />
          </Col>
          <Col sm={6}>
            <FormField
              label="Country"
              type="select"
              options={Country.getAllCountries().map((item) => ({
                label: item.name,
                value: item.isoCode,
              }))}
              name="country"
              value={formData.country}
              onChange={(selectedOption) => {
                const { name, value, label } = selectedOption.target;

                dispatch(
                  updateFormData({
                    country: label,
                    countryIsoCode: value,
                    states: "",
                    statesIsoCode: "",
                    city: "",
                    mobile: "",
                  })
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col className="mb-xs-2">
            <Form.Label className="fw-bold" style={{ fontSize: "0.8rem" }}>
              Mobile <span style={{ color: "rgba(217, 64, 4, 1)" }}>*</span>
            </Form.Label>
            <PhoneInput
              inputClass="form-field text-white w-100 "
              buttonClass="form-field"
              country={formData?.countryIsoCode?.toLowerCase()}
              enableSearch={true}
              countryCodeEditable={false}
              value={formData?.mobile}
              onChange={(phone, code) => {
                dispatch(
                  updateFormData({
                    mobile: phone,
                    countryCode: code.countryCode,
                    dialCode: code.dialCode,
                  })
                );
              }}
            />
            {/*   <FormField
                        label='Mobile*'
                        type='tel'
                        placeholder='Mobile No'
                        name='mobile'
                        value={formData.mobile}
                        onChange={handleInputChange}

                    /> */}
          </Col>
          <Col sm={6}>
            <FormField
              label="Select State"
              type="select"
              options={[
                // { label: '--Select State--', value: '' },
                ...State.getStatesOfCountry(formData.countryIsoCode).map(
                  (item) => ({
                    label: item.name,
                    value: item.isoCode,
                  })
                ),
              ]}
              name="states"
              disabled={
                !State.getStatesOfCountry(formData.countryIsoCode) ||
                State.getStatesOfCountry(formData.countryIsoCode).length === 0
              }
              value={formData.states}
              onChange={(selectedOption) => {
                const { name, value, label } = selectedOption.target;

                dispatch(
                  updateFormData({
                    states: label,
                    statesIsoCode: value,
                    city: "",
                  })
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <FormField
              label="Email"
              type="email"
              placeholder="Email Id"
              name="email"
              maxLength={50}
              value={formData.email}
              onChange={handleInputChange}
            />
          </Col>
          <Col sm={6}>
            <FormField
              label="Select City"
              type="select"
              options={
                formData.statesIsoCode
                  ? City.getCitiesOfState(
                      formData.countryIsoCode,
                      formData.statesIsoCode
                    ).map((item) => ({
                      label: item.name,
                      value: item.name,
                    }))
                  : City.getCitiesOfCountry(formData.countryIsoCode).map(
                      (item) => ({
                        label: item.name,
                        value: item.name,
                      })
                    )
              }
              //     options={ [
              //         // { label: '--Select City--', value: '' },
              //         ...City.getCitiesOfCountry(formData.countryIsoCode).map((item) => ({
              //  label: item.name,
              //  value: item.name,
              //       })),]
              //     }
              name="city"
              value={formData.city}
              disabled={
                formData?.states
                  ? !City.getCitiesOfState(
                      formData.countryIsoCode,
                      formData.statesIsoCode
                    ) ||
                    City.getCitiesOfState(
                      formData.countryIsoCode,
                      formData.statesIsoCode
                    ).length === 0
                  : (!City.getCitiesOfState(
                      formData.countryIsoCode,
                      formData.statesIsoCode
                    ) ||
                      City.getCitiesOfState(
                        formData.countryIsoCode,
                        formData.statesIsoCode
                      ).length === 0) &&
                    (!City.getCitiesOfCountry(formData.countryIsoCode) ||
                      City.getCitiesOfCountry(formData.countryIsoCode)
                        .length === 0)
              }
              onChange={(selectedOption) => {
                const { name, value, label } = selectedOption.target;

                dispatch(
                  updateFormData({
                    city: label,
                    // cityIsoCode: value
                  })
                );
              }}
            />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <FormField
              label="Password"
              type="password"
              placeholder="Create a Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <p style={{ fontSize: "0.8rem" }}>
              (Must be at least 8 characters)
            </p>
          </Col>
          <Col>
            <FormField
              label="Confirm Password"
              type="password"
              placeholder="Re-Enter Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </Col>
        </Row>

        <hr
          className="mt-0"
          style={{ borderWidth: "2px", color: "rgba(255, 255, 255, 0.34)" }}
        />

        <Row className="text-center d-flex justify-content-center">
          <Col md={6}>
            <Button
              variant="transparent"
              type="submit"
              className="text-white w-100 my-2 fw-bold form-btn"
              //   onClick={()=>router.push('/auth/otp')}
            >
              {isLoading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Create New Account"
              )}
            </Button>
            <p className="text-secondary mb-0">
              Already have an account?{" "}
              <Link
                href={"/auth/signin"}
                style={{ textDecoration: "none", color: "#CAA257" }}
              >
                Log in
              </Link>
            </p>
          </Col>
        </Row>
      </Form>
    </GlassCard>
  );
}

export default SignupCard;
