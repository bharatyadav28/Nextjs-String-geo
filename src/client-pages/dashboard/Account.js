import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Nav,
  Row,
  Spinner,
  Tab,
  Table,
} from "react-bootstrap";
import { FaChevronRight, FaCloudArrowUp } from "react-icons/fa6";
import FormField from "../../components/FormField";
import { LuUserCircle2 } from "react-icons/lu";
import { LiaCrownSolid } from "react-icons/lia";
import { FaCrown, FaFileAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAuth,
  selectAuth,
  setIsActivePlan,
  setUser,
} from "../../features/authSlice";
import { getError } from "../../utils/error";
import toast from "react-hot-toast";
import {
  imgAddr,
  useCancelSubscriptionMutation,
  useDeleteUserMutation,
  useGetMyPlanMutation,
  useGetProfileMutation,
  useGetTransactionHistoryMutation,
  useLogoutUserMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useUpdateProfilePicMutation,
} from "../../features/api";
import { handleLogout } from "../../utils/functions";
import ScrollToTop from "../../components/ScrollToTop";
// import lottie from "lottie-web";
// import { defineElement } from "@lordicon/element";
import "./Account.css";
import PhoneInput from "react-phone-input-2";
import parsePhoneNumberFromString, {
  parsePhoneNumber,
} from "libphonenumber-js";
import Skeleton from "react-loading-skeleton";
import "react-image-crop/dist/ReactCrop.css";
import AvatarEditor from "react-avatar-editor";
import MotionDiv from "../../components/MotionDiv";

import { useRouter } from "next/navigation";

function Account() {
  // defineElement(lottie.loadAnimation);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const [showPicModal, setShowPicModal] = useState(false);
  const handleShowPicModal = () => setShowPicModal(true);
  const handleClosePicModal = () => setShowPicModal(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleDeleteAccount = () => setShowDeleteModal(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const [showCancelAutopayModal, setShowCancelAutopayModal] = useState(false);
  const handleShowCancelAutopayModal = () => setShowCancelAutopayModal(true);
  const handleCloseCancelAutopayModal = () => setShowCancelAutopayModal(false);
  const dispatch = useDispatch();
  const [getProfileLoading, setGetProfileLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [picToUpload, setPicToUpload] = useState(null);
  const [picPreview, setPicPreview] = useState(null);

  let { refreshToken, user } = useSelector(selectAuth);
  const [logoutUser] = useLogoutUserMutation();

  const [getProfile] = useGetProfileMutation();
  const [getTransactionHistory] = useGetTransactionHistoryMutation();
  const [cancelSubscription, { isLoading: autopayLoading }] =
    useCancelSubscriptionMutation();
  const [getMyPlan] = useGetMyPlanMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [updateProfile] = useUpdateProfileMutation();
  const [updateProfilePic] = useUpdateProfilePicMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const [transactions, setTransactions] = useState([]);
  const [plan, setPlan] = useState("");
  // const [pdfSrc, setPdfSrc] = useState(null);

  const userImg = "/user.jpg";

  const avatar = `${imgAddr}/${user?.avatar}`;

  const [scale, setScale] = useState(1);
  const [editor, setEditor] = useState(null);

  const getCountryCode = (phoneNumber, countryCode) => {
    try {
      const phoneNumberString = phoneNumber.toString();
      const parsedPhoneNumber = parsePhoneNumberFromString(
        phoneNumberString,
        countryCode.toUpperCase()
      );

      setMobile(parsedPhoneNumber?.number);
      if (parsedPhoneNumber) {
        return parsedPhoneNumber.country;
      }

      return null;
    } catch (error) {
      console.error("Error parsing phone number:", error);
      return null;
    }
  };

  const getAccount = async () => {
    try {
      setGetProfileLoading(true);
      const data = await getProfile().unwrap();
      setGetProfileLoading(false);
      const { user } = data;

      dispatch(setUser(data?.user));
      dispatch(setIsActivePlan(data?.isActivePlan));

      setName(user?.name);
      setEmail(user?.email);
      // setMobile(data.mobile);
      setDob(user?.dob);
      setCountryCode(user?.country_code);
      getCountryCode(user?.mobile, user?.country_code);
    } catch (error) {
      setGetProfileLoading(false);
      console.log("Error fetching profile", error);

      // if (error.response && error.response.status === 401 && isTokenExpired(accessToken)) {
      //   await handleTokenRefresh({dispatch,refreshToken,accessToken});
      //   return getAccount();
      // }

      getError(error);
    }
  };

  const getTransactions = async () => {
    try {
      const { transactions } = await getTransactionHistory().unwrap();
      setTransactions(transactions);
    } catch (error) {
      console.log("Error fetching transaction history", error);
      //  getError(error);
    }
  };

  const getSubscription = async () => {
    try {
      const data = await getMyPlan().unwrap();

      setPlan(data);
    } catch (error) {
      console.log("Error fetching subscription", error);

      //  getError(error);
    }
  };

  const handleImageChange = (e) => {
    const selectedImg = e?.target?.files[0];

    if (selectedImg) {
      if (selectedImg.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
      } else {
        setPicToUpload(selectedImg);

        setPicPreview(URL.createObjectURL(selectedImg));
      }
    }
  };

  const handleImgUpload = async () => {
    try {
      if (!picToUpload) {
        return;
      }

      const formData = new FormData();
      formData.append("image", picToUpload);

      setPicLoading(true);
      const data = await updateProfilePic(formData).unwrap();

      dispatch(setUser(data?.user));
      setPicLoading(false);

      toast.success(data?.message);
      handleClosePicModal();
      setPicPreview(null);
    } catch (error) {
      setPicLoading(false);
      setPicPreview(null);
      console.log(error);
      getError(error);
    }
  };

  useEffect(() => {
    if(refreshToken){

    
    getAccount();
    getTransactions();
    getSubscription();
    // getCountryCode('919970325614');
    }
  }, [refreshToken]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (mobile) {
      const phoneNumber = parsePhoneNumber(mobile, countryCode?.toUpperCase());
      if (phoneNumber && phoneNumber.isValid()) {
        if (name) {
          try {
            setProfileLoading(true);
            const data = await updateProfile({
              name,
              dob,
              email,
              mobile,
              country_code: countryCode,
            }).unwrap();
            setProfileLoading(false);
            dispatch(setUser(data?.user));
            toast.success(data?.message);
          } catch (error) {
            setProfileLoading(false);
            console.log("Error updating profile", error);
            getError(error);
          }
        } else {
          toast.error("Please Enter your fullname");
        }
      } else {
        toast.error("Enter a valid mobile number");
      }
    } else {
      toast.error("Enter Mobile number");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      setPasswordLoading(true);
      const response = await updatePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      }).unwrap();
      setPasswordLoading(false);
      toast.success(response?.message);
      setNewPassword("");
      setOldPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordLoading(false);
      console.log("Error updating profile", error);
      getError(error);
    }
  };

  const handleDownloadPDF = (url) => {
    const link = document.createElement("a");
    link.href = url;
    // link.target = '_blank';
    link.download = "StringGeo_invoice.pdf";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleteLoading(true);
      const data = await deleteUser().unwrap();
      setDeleteLoading(false);
      dispatch(clearAuth());
      toast.success(data?.message);
      toast.success("See you soon!");
    } catch (error) {
      setDeleteLoading(false);
      console.error("Error deleting account", error);
      getError(error);
    } finally {
      setDeleteLoading(false);
      setShowModal(false);
    }
  };

  const handleSave = () => {
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob((blob) => {
        const file = new File([blob], picToUpload?.name, {
          type: picToUpload?.type,
          lastModified: picToUpload?.lastModified,
        });
        setPicToUpload(file);
      }, picToUpload?.type);
    }
  };

  const handleCancelAutopay = async () => {
    try {
      const data = await cancelSubscription().unwrap();

      console.log(data);
      toast.success(data?.message);
      handleCloseCancelAutopayModal();
      getAccount();
      getTransactions();
      getSubscription();
    } catch (error) {
      getError(error);
    }
  };

  return (
    <section className="  account-bg full-section">
      <ScrollToTop />
      <MotionDiv initial={{ x: "100%" }}>
        <Container>
          <h2 className="text-white text-center fw-bold pt-2">My Account</h2>

          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Row
              className="m-2 mt-4 text-white"
              style={{ minHeight: "calc(78vh)" }}
            >
              <Col
                lg={4}
                md={12}
                className="px-0"
                style={{ display: "grid", alignItems: "normal" }}
              >
                <Row className="justify-content-center pb-2 ">
                  <Col lg={5} className="text-center">
                    <Image
                      fluid
                      src={avatar || userImg}
                      className="p-1"
                      style={{
                        height: "100px",
                        aspectRatio: "1/1",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "2px solid white",
                      }}
                    />
                    <div className="">
                      <Button
                        variant="transparent"
                        style={{ color: "#CAA257" }}
                        onClick={handleShowPicModal}
                      >
                        <u>Click to upload</u> <FaCloudArrowUp />
                      </Button>
                    </div>
                  </Col>
                  <Col
                    lg={6}
                    md={12}
                    className="d-flex align-items-center p-2 justify-content-lg-start justify-content-center text-lg-start text-center "
                  >
                    <div style={{ maxWidth: "100%", wordWrap: "break-word" }}>
                      <h5>{user?.name}</h5>
                      <p style={{ color: "#CAA257" }} className="text-no">
                        {user?.email}
                      </p>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                </Row>

                <hr style={{ borderWidth: "2px" }} />

                <Nav variant="pills" className="flex-column ">
                  <Nav.Item className="m-sm-2">
                    <Nav.Link eventKey="first" className="  text-white">
                      <Row>
                        {/* <Col className='d-flex align-items-center justify-content-center'>
                <LuUserCircle2 size={35}/>
                </Col>
                <Col md={8} className='p-0'>
                <h5>Personal Info</h5>
              <p className='' style={{fontSize:'0.9rem',}}>Manage your account details & Password</p>
                </Col>
                <Col className='d-flex align-items-center justify-content-center'>
                <FaChevronRight size={20}/>
                </Col> */}
                        <Col
                          xs={12}
                          className="d-flex align-items-center justify-content-between p-1"
                        >
                          <LuUserCircle2 size={35} />
                          <div className="ml-2 ms-1">
                            <h5>Personal Info</h5>
                            <p className="" style={{ fontSize: "0.9rem" }}>
                              Manage your account details & Password
                            </p>
                          </div>
                          <FaChevronRight
                            size={20}
                            style={{ marginLeft: "auto" }}
                          />
                        </Col>
                      </Row>
                    </Nav.Link>
                  </Nav.Item>
                  <hr style={{ borderWidth: "2px" }} />
                  <Nav.Item className="m-2">
                    <Nav.Link eventKey="second" className="text-white">
                      <Row>
                        <Col
                          xs={12}
                          className="d-flex align-items-center justify-content-between p-1"
                        >
                          <LiaCrownSolid size={35} />
                          <div className="ml-2 ms-1">
                            <h5>Subscription Plan</h5>
                            <p className="" style={{ fontSize: "0.9rem" }}>
                              See active plan & Transactions
                            </p>
                          </div>
                          <FaChevronRight
                            size={20}
                            style={{ marginLeft: "auto" }}
                          />
                        </Col>
                      </Row>
                    </Nav.Link>
                  </Nav.Item>
                </Nav>

                <Row className="d-flex align-items-end">
                  <Col className="d-flex justify-content-between p-3">
                    <Button
                      variant="dark"
                      className="text-white px-4"
                      onClick={() =>
                        handleLogout({
                          dispatch,
                          navigate: router.replace,
                          refreshToken,
                          logoutUser,
                        })
                      }
                    >
                      Log Out
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col className="px-0 details-container">
                <Tab.Content className="p-0">
                  <Tab.Pane eventKey="first">
                    <Row>
                      <Col>
                        <Form className="p-md-3" onSubmit={handleProfileUpdate}>
                          <h5>
                            <FaUserCircle size={25} className="mb-1" /> Account
                            Details
                          </h5>
                          <Row>
                            <Col>
                              <FormField
                                label="Full Name"
                                type="text"
                                name="name"
                                value={name}
                                maxLength={25}
                                onChange={(e) => setName(e.target.value)}
                                loading={getProfileLoading}
                              />
                            </Col>
                            <Col>
                              <Form.Label
                                className="fw-bold"
                                style={{ fontSize: "0.8rem" }}
                              >
                                Mobile
                              </Form.Label>
                              {getProfileLoading ? (
                                <Skeleton height={"2rem"} />
                              ) : (
                                <PhoneInput
                                  inputClass="form-field text-white w-100"
                                  buttonClass="form-field"
                                  dropdownClass="text-black "
                                  country={
                                    countryCode
                                      ? countryCode.toLowerCase()
                                      : null
                                  }
                                  enableSearch={true}
                                  countryCodeEditable={false}
                                  value={mobile ? mobile : null}
                                  onChange={(phone, code) => {
                                    setMobile(phone);
                                    setCountryCode(code.countryCode);
                                  }}
                                />
                              )}
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <FormField
                                label="Email Address"
                                type="email"
                                name="email"
                                disabled={true}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                loading={getProfileLoading}
                              />
                            </Col>
                            <Col>
                              <FormField
                                label="DOB"
                                type="date"
                                name="dob"
                                required={false}
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                loading={getProfileLoading}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col className="text-md-end ">
                              <Button
                                variant="transparent"
                                className="cancel-btn m-1 px-md-5 px-md-5 px-4"
                              >
                                {" "}
                                Cancel{" "}
                              </Button>
                              <Button
                                variant="transparent"
                                className="form-btn text-white m-1 px-3"
                                type="submit"
                              >
                                {profileLoading ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  "Save Changes"
                                )}
                              </Button>
                            </Col>
                          </Row>
                        </Form>
                      </Col>
                    </Row>

                    <hr style={{ borderWidth: "2px" }} />

                    <Row>
                      <Col>
                        <Form className="p-md-3">
                          <h5>
                            <Image src="/images/lock.svg" height={"25px"} />{" "}
                            Password & Security
                          </h5>
                          <Row>
                            <Col>
                              <FormField
                                label="Current Password"
                                type="password"
                                name="oldPassword"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <FormField
                                label="New Password"
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                            </Col>
                            <Col>
                              <FormField
                                label="Confirm New Password"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col className="text-md-end">
                              <Button
                                variant="transparent"
                                className="cancel-btn m-1 px-md-5 px-4"
                              >
                                {" "}
                                Cancel{" "}
                              </Button>
                              <Button
                                variant="transparent"
                                className="form-btn text-white m-1 px-3"
                                type="submit"
                                onClick={handlePasswordUpdate}
                              >
                                {passwordLoading ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  "Update Password"
                                )}
                              </Button>
                            </Col>
                          </Row>
                        </Form>{" "}
                      </Col>
                    </Row>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <div className="p-3">
                      <h5 className="fw-bold">
                        {" "}
                        <Image
                          src="/images/crown.svg"
                          style={{ marginBottom: "10px" }}
                        />{" "}
                        Subscription Plan & Transaction History
                      </h5>
                      <Table responsive className="account-table" border={1}>
                        <thead>
                          <tr className="">
                            <td
                              style={{ color: "#CAA257" }}
                              className="fw- py-3"
                            >
                              <h5>My Subscription Plan</h5>
                            </td>
                            <td></td>

                            <td className="text-end py-3">
                              {plan && plan?.data && plan?.data?.expiry_date ? (
                                <span
                                  style={{ backgroundColor: "gray" }}
                                  className="p-1"
                                >
                                  Plan Expiring On:{" "}
                                  {new Date(
                                    plan?.data?.expiry_date
                                  ).toLocaleDateString("en-GB")}
                                </span>
                              ) : null}
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ verticalAlign: "middle" }}>
                            <td className="py-3">
                              Active Plan:{" "}
                              <span className="fw-bold">
                                {plan?.data?.actual_price
                                  ? `${plan?.data?.inr_price ? "₹" : "$"} ${
                                      plan?.data?.actual_price
                                    }/-`
                                  : "No active plan"}
                                {/* { plan?.data?.inr_price ? `₹${plan?.data?.inr_price}/-` 
                                :
                                plan?.data?.usd_price ? `$${plan?.data?.usd_price}/-`
                                :'No active plan'} */}
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="text-center py-1 plan-btn">
                                {plan?.data?.plan_name}
                              </div>
                            </td>
                            <td className="text-end py-3">
                              {plan?.data?.plan_type === "annual" &&
                              plan?.data?.allow_devices === 4 ? null : (
                                <Button
                                  variant="transparent"
                                  className="form-btn text-white py-1 text-nowrap"
                                  onClick={() => router.push("/auth/billing")}
                                >
                                  Upgrade Plan <FaCrown className="mb-1" />{" "}
                                </Button>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                      {user?.subscription_id ? (
                        <p className="text-end">
                          <u
                            style={{
                              color: "var(--primary-color)",
                              cursor: "pointer",
                            }}
                            className="text-end"
                            onClick={handleShowCancelAutopayModal}
                          >
                            Cancel Autopay
                          </u>
                        </p>
                      ) : null}
                    </div>
                    <hr style={{ borderWidth: "2px" }} />
                    <div className="p-3">
                      <h5 style={{ color: "#CAA257" }}>Transaction History</h5>
                      <div style={{ overflowY: "auto", maxHeight: "35vh" }}>
                        <Table responsive className="account-table" border={1}>
                          <thead>
                            <tr className="">
                              <td className="py-3 text-nowrap">Plan</td>
                              <td className="py-3 text-nowrap">Expiry Date</td>
                              <td className="py-3 text-nowrap">Amount</td>
                              <td className="py-3 text-nowrap">Payment ID</td>
                              <td className="py-3 text-nowrap">Payment Date</td>
                              <td className="py-3 text-nowrap">Invoice</td>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions?.map((transaction) => (
                              <tr
                                key={transaction?._id}
                                style={{
                                  fontSize: "0.80rem",
                                  verticalAlign: "middle",
                                }}
                              >
                                <td className="py-3">
                                  <div className="text-center py-1 px-1 plan-btn">
                                    {transaction?.order?.plan_name}
                                  </div>
                                </td>
                                <td className="py-3">
                                  {new Date(
                                    transaction?.order?.expiry_date
                                  ).toLocaleDateString("en-GB")}{" "}
                                </td>
                                <td className="py-3">
                                  {" "}
                                  {transaction?.order?.inr_price
                                    ? "₹"
                                    : "$"}{" "}
                                  {transaction?.order?.inr_price ||
                                    transaction?.order?.usd_price}
                                  /-
                                </td>
                                <td className="py-3">
                                  {transaction?.payment_id}
                                </td>
                                <td className="py-3">
                                  {new Date(
                                    transaction?.createdAt
                                  ).toLocaleDateString("en-GB")}
                                </td>
                                <td className="py-3">
                                  <Button
                                    variant="transparent"
                                    className="form-btn text-white py-1 text-nowrap"
                                    //  onClick={()=>handleShow(transaction?.invoice_url)}
                                    disabled={!transaction?.invoice_url}
                                    onClick={() =>
                                      handleDownloadPDF(
                                        `${imgAddr}/${transaction?.invoice_url}`
                                      )
                                    }
                                  >
                                    Download <FaFileAlt />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Container>
      </MotionDiv>

      {/*Invoice modal */}
      {/* <Modal show={showModal} onHide={handleClose} className='text-white'>
  <Modal.Header closeButton>
    <Modal.Title>Invoice</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  {pdfSrc && <iframe src={pdfSrc} style={{ width: '100%', height: '500px', border: 'none' }}></iframe>}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="transparent" className='cancel-btn' onClick={handleClose}>
      Close
    </Button>
  </Modal.Footer>
</Modal> */}

      {/*Confirm Cancel autopay modal */}
      <Modal
        show={showCancelAutopayModal}
        onHide={handleCloseCancelAutopayModal}
        className="text-white"
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Autopay</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel the autopay on your account? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="transparent"
            className="form-btn text-white"
            onClick={handleCloseCancelAutopayModal}
          >
            Cancel
          </Button>
          <Button
            variant="transparent"
            disabled={autopayLoading}
            className="cancel-btn"
            onClick={handleCancelAutopay}
          >
            {autopayLoading ? <Spinner size="sm" /> : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Confirm Delete a/c modal */}
      <Modal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        className="text-white"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="transparent"
            className="form-btn text-white"
            onClick={handleCloseDeleteModal}
          >
            Cancel
          </Button>
          <Button
            variant="transparent"
            disabled={deleteLoading}
            className="cancel-btn"
            onClick={handleConfirmDelete}
          >
            {deleteLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Image upload modal */}

      <Modal show={showPicModal} onHide={handleClosePicModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-white">
            Change Profile Picture
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {picPreview && (
            <Row>
              <Col className="text-center">
                <AvatarEditor
                  ref={(editor) => setEditor(editor)}
                  image={picPreview}
                  width={150}
                  height={150}
                  onPositionChange={handleSave}
                  onImageReady={handleSave}
                  color={[0, 0, 0, 0.5]}
                  scale={scale}
                  onScaleChange={(scale) => setScale(scale)}
                  borderRadius={75}
                  crossOrigin="anonymous"
                />
              </Col>
            </Row>
          )}

          <br />

          {/* <Cropper
        
      image={userImg}
      crop={crop}
      zoom={zoom}
      aspect={1 / 1}
      cropShape='round'
      onCropChange={setCrop}
      onCropComplete={onCropComplete}
      onZoomChange={setZoom}
    /> */}

          <Form className="text-center px-md-4">
            <Form.Control
              type="file"
              id="profilePicture"
              label="Choose a new profile picture"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="transparent"
            disabled={picLoading}
            className="cancel-btn"
            onClick={handleClosePicModal}
          >
            Close
          </Button>
          <Button
            variant="transparent"
            className="form-btn text-white"
            onClick={handleImgUpload}
          >
            {picLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default Account;
