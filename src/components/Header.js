import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Form,
  Image,
  InputGroup,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import HeaderLogo from "./HeaderLogo";
import { LuUserCircle2 } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { AiOutlineFire } from "react-icons/ai";
import "./Header.css";
import { HiOutlineLogout } from "react-icons/hi";
import { IoBookmarkOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, setIsActivePlan, setUser } from "../features/authSlice";
import {
  imgAddr,
  useGetGenresQuery,
  useGetProfileMutation,
  useLogoutUserMutation,
} from "../features/api";
import { clickSubBtn, handleLogout } from "../utils/functions";
import useScrollListener from "./useScroll";
import { useMediaQuery } from "react-responsive";

import { useRouter, usePathname } from "next/navigation";

function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { accessToken, refreshToken, user } = useSelector(selectAuth);
  const [logoutUser] = useLogoutUserMutation();
  const [getProfile] = useGetProfileMutation();
  const { data } = useGetGenresQuery();
  const [genres, setGenres] = useState([]);
  const navbarRef = useRef(null);
  const [search, setSearch] = useState("");

  const pathname = usePathname();
  const [isClientEnv, setIsClientEnv] = useState(false);

  const sLogo = "/logo/swhite.png";
  // const handleOffcanvasHide = () => {
  //   setShowOffcanvas(false);
  // };

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${search}`);
    handleNavItemClick();
  };

  const handleReset = () => {
    router.push(`/search`);
  };

  const getAccount = async () => {
    try {
      const data = await getProfile().unwrap();
      dispatch(setUser(data?.user));
      dispatch(setIsActivePlan(data?.isActivePlan));
    } catch (error) {
      console.log("Error fetching profile", error);
    }
  };

  useEffect(() => {
    setIsClientEnv(true);
  }, []);

  useEffect(() => {
    if (accessToken) {
      getAccount();
    }
  }, [accessToken]);

  // const fetchGenres = async()=>{
  //   try {
  //     const data = await getGenres().unwrap();
  //     console.log(data);
  //     setGenres(data?.genres);
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    setGenres(data?.genres);
  }, [data]);

  // useEffect(()=>{
  //   if(refreshToken){
  //     // fetchGenres();
  //   }

  // },[refreshToken] )

  const [navClassList, setNavClassList] = useState([]);
  const scroll = useScrollListener();

  useEffect(() => {
    const _classList = [];
    if (scroll.y > 10 && scroll.y - scroll.lastY > 0)
      _classList.push("nav-bar--hidden");
    setNavClassList(_classList);
  }, [scroll.y, scroll.lastY]);

  // const handleOffcanvasHide = () => {
  //   // setRemoveList(false);
  //   const _classList = [];
  //   _classList.pop("show");
  //   setShowOffcanvas(_classList);
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef?.current && !navbarRef?.current?.contains(event?.target)) {
        const isOpened = document
          ?.querySelector(".navbar-collapse")
          ?.classList?.contains("show");
        if (isOpened) {
          document.querySelector("button.navbar-toggler").click();
        }
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleNavItemClick = () => {
    const navbarToggler = document.querySelector("button.navbar-toggler");
    if (navbarToggler && window.innerWidth < 1200) {
      navbarToggler.click();
    }
  };

  const expand = accessToken ? "xl" : true;
  const userPic = "/user.jpg";
  const avatar = `${imgAddr}/${user?.avatar}`;
  const userDrop = (
    <Image
      fluid
      src={avatar || userPic}
      className="p-1"
      style={{
        maxHeight: "35px",
        objectFit: "cover",
        aspectRatio: "1/1",
        borderRadius: "50%",
      }}
    />
  );

  // const genresToShow = genres?.filter(option => option?.name !== 'Carousel').slice(0, 5);
  // const remainingGenres = genres?.filter(option => option?.name !== 'Carousel').slice(5);

  const isMicroDevice = useMediaQuery({ maxWidth: 400 });

  const isMobileDevice = useMediaQuery({ maxWidth: 570 });
  const navRef = useRef(null);

  const calculateVisibleGenres = () => {
    const navbarWidth = navbarRef.current?.clientWidth || 0;
    const estimatedItemPadding = 20;

    const item = document.createElement("span");
    item.className = "mx-2 ";
    item.textContent = "Sample Item";
    document.body.appendChild(item);
    const itemWidth = item.offsetWidth;
    document.body.removeChild(item);

    const maxVisibleItems = Math.floor(
      (navbarWidth - estimatedItemPadding) / (itemWidth + estimatedItemPadding)
    );

    const genresToShow = genres
      ?.filter((option) => option?.name !== "Carousel")
      .slice(0, maxVisibleItems);
    const remainingGenres = genres
      ?.filter((option) => option?.name !== "Carousel")
      .slice(maxVisibleItems);

    return { genresToShow, remainingGenres };
  };

  const { genresToShow, remainingGenres } =
    isClientEnv && calculateVisibleGenres();

  return (
    <>
      {/* <nav
    
          style={{
            position:'fixed',
            top: '0',
            left: '0',
            // margin:'-60px',
            width: '100%',
            height: '60px',
            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
            backdropFilter: 'blur(5px)', 
            // webkitBackdropFilter: 'blur( 10px )' ;
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: '998',
            // display: visible ? 'block' : 'none'
           
          }}
          
          // className={` ${navClassList.join(" ")}`}
    ></nav> */}

      <Navbar
        key={expand}
        expand={expand}
        style={{ fontSize: "1.1rem" }}
        className={`main-header ${navClassList.join(" ")}`}
        // bg="dark"
        data-bs-theme="dark"
        sticky="top"
        collapseOnSelect
        ref={navbarRef}
      >
        <Container
          fluid
          className={`${accessToken ? "login-nav" : "centered-menu"}`}
        >
          {/* {isLoggedIn? <Navbar.Brand href="#" ><HeaderLogo maxHeight='48px' height='48px'/></Navbar.Brand>:null}    */}
          <Navbar.Brand onClick={() => router.push("/")}>
            {!accessToken && isMobileDevice ? (
              <Image src={sLogo} style={{ maxHeight: "40px" }} fluid />
            ) : (
              <HeaderLogo maxHeight="42px" height="42px" />
            )}
          </Navbar.Brand>

          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Collapse on>
            {accessToken ? (
              <>
                <Nav className="justify-content-center flex-grow-1 pe-3 ">
                  <Nav.Link
                    onClick={() => {
                      handleNavItemClick();
                      router.push("/");
                    }}
                    className={`mx-2  ${pathname === "/" ? "active" : ""}`}
                  >
                    Home
                  </Nav.Link>

                  {/* {genresToShow?.map((option, index) => (
                <Nav.Link
                  key={option?._id}
                  onClick={() => {
                    handleNavItemClick();
                    router.push(`/genre/${option?._id}`);
                  }}
                  style={{whiteSpace:'nowrap'}}
                  className={`mx-2  ${
                    window.location.pathname === `/genre/${option?._id}` ? 'active' : ''
                  }`}
                >
                  {option?.name}
                </Nav.Link>
              ))}
              {remainingGenres?.length > 0 && ( 
                <NavDropdown title="More" menuVariant="dark" drop='drop-centered' className="rounded-pill user-drop">
                  {remainingGenres.map((option, index) => (
                    <NavDropdown.Item
                      key={option?._id}
                      onClick={() => {
                        handleNavItemClick();
                        router.push(`/genre/${option?._id}`);
                      }}
                    >
                      {option?.name}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )} */}
                  {genres
                    ?.filter((option) => option?.name !== "Carousel")
                    .map((option, index) => (
                      <Nav.Link
                        key={option?._id}
                        onClick={() => {
                          handleNavItemClick();
                          router.push(`/genre/${option?._id}`);
                        }}
                        style={{ whiteSpace: "nowrap" }}
                        className={`mx-2  ${
                          pathname === `/genre/${option?._id}` ? "active" : ""
                        }`}
                      >
                        {option?.name}
                      </Nav.Link>
                    ))}
                </Nav>

                <Form className="d-flex m-2" onSubmit={handleSearch}>
                  <InputGroup className="mb-">
                    <InputGroup.Text className="border-0 bg-dark btn m-0 p-1">
                      <FiSearch size={22} color="#CAA257" />
                    </InputGroup.Text>
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2  border-0 "
                      aria-label="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      // onBlur={handleReset}
                      // required
                    />
                  </InputGroup>
                  {/* <Button variant="outline-success">Search</Button> */}
                </Form>

                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title={userDrop}
                  menuVariant="dark"
                  className="rounded-pill p-2 user-drop"
                >
                  <NavDropdown.Item onClick={() => router.push("/free-trail")}>
                    <AiOutlineFire /> Free Content
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => router.push("/dashboard/watchlist")}
                  >
                    <IoBookmarkOutline /> My Watchlist
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => router.push("/dashboard/account")}
                  >
                    <FaRegUser /> My Account
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={() =>
                      handleLogout({
                        dispatch,
                        navigate: router.push,
                        refreshToken,
                        logoutUser,
                      })
                    }
                  >
                    <HiOutlineLogout /> Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  {/* <Nav.Link href="#action1">Home</Nav.Link> */}

                  <Button
                    variant="transparent"
                    className={`rounded-pill px-md-4 py-0 m-1 mt-2 mx-2  trailer-btn ${
                      pathname === "/free-trail" ? "active" : ""
                    }`}
                    onClick={() => {
                      handleNavItemClick();
                      router.push("/free-trail");
                    }}
                    style={{ height: "2rem" }}
                  >
                    Free
                  </Button>

                  <Button
                    onClick={() => {
                      handleNavItemClick();
                      // router.push('/auth/signup')
                      clickSubBtn(router.push);
                    }}
                    variant="transparent"
                    className="rounded-pill px-md-4 py-0  text-white mx-md-2 m-1 sub-btn"
                  >
                    Subscribe
                  </Button>
                  <Button
                    onClick={() => {
                      handleNavItemClick();
                      router.push("/auth/signin");
                    }}
                    variant="transparent"
                    className="rounded-pill px-md-3 m-1 mx-md-2 login-btn"
                  >
                    Login{" "}
                    {isMobileDevice ? null : (
                      <LuUserCircle2 size={19} className="mb-1" />
                    )}{" "}
                  </Button>
                </Nav>
              </>
            )}

            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
            {/* </Offcanvas.Body> */}
            {/* </Offcanvas> */}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
