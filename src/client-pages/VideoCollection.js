import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Nav,
  NavDropdown,
  Row,
} from "react-bootstrap";
import { LuChevronsUpDown } from "react-icons/lu";
import { MdLanguage, MdOutlineTune } from "react-icons/md";
import VideoCard from "../components/VideoCard";
import ScrollToTop from "../components/ScrollToTop";
import { useGetAllVideosMutation, useGetLanguagesQuery } from "../features/api";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
import { selectAuth } from "../features/authSlice";

import { useRouter, useSearchParams } from "next/navigation";

function VideoCollection({ id }) {
  const { user } = useSelector(selectAuth);
  const [getAllVideos, { isLoading }] = useGetAllVideosMutation();
  const { data } = useGetLanguagesQuery();
  const [videoData, setVideoData] = useState([]);
  const [totalVideoCount, setTotalVideoCount] = useState(0);
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("all");
  const [allLanguages, setAllLanguages] = useState([]);
  const [language, setLanguage] = useState(null);
  const [sort, setSort] = useState(null);

  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const handleInfinityScroll = async () => {
    try {
      // console.log('Current page',currentPage);
      // console.log('has more',hasMore);
      if (
        window.innerHeight + document.documentElement.scrollTop + 1 >=
        document.documentElement.scrollHeight
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleInfinityScroll);
    return () => window.removeEventListener("scroll", handleInfinityScroll);
  }, []);

  useEffect(() => {
    setHasMore(totalVideoCount > videoData?.length);
  }, [totalVideoCount, videoData]);

  useEffect(() => {
    setVideoData([]);
    const query = searchParams.get("query");
    const category = searchParams.get("category");

    //  setSearch(query);

    //  setHasMore(false);

    fetchVideos(true, query, category);
  }, [id, search, language, sort, searchParams]);

  useEffect(() => {
    // setCurrentPage(1)
    // setVideoData([]);
    // setHasMore(true);

    if (currentPage > 1 && hasMore) {
      fetchVideos();
    }
  }, [currentPage, hasMore]);

  useEffect(() => {
    setAllLanguages(data?.languages);
  }, [data]);

  const fetchVideos = async (reset = false, query, category) => {
    try {
      reset && setCurrentPage(1);
      let parameters = "";
      const paramsArray = [
        `keyword=${query || "all"}`,
        user ? `id=${user?._id}` : "",
        id ? `genres=${id}` : "",
        language ? `language=${language?._id}` : "",
        sort ? `sortBy=${sort}` : "",
        category ? `category=${category}` : "",
      ].filter(Boolean);

      if (paramsArray.length > 0) {
        parameters = `?${paramsArray.join("&")}&resultPerPage=20&currentPage=${
          reset ? 1 : currentPage
        }`;
        const response = await getAllVideos(parameters).unwrap();
        setVideoData((prev) =>
          reset ? response?.videos : [...prev, ...response?.videos]
        );
        setTotalVideoCount(response?.totalVideoCount);
      }
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [isFilterByOpen, setIsFilterByOpen] = useState(false);

  const handleDropdownToggle = (dropdownType) => {
    switch (dropdownType) {
      case "language":
        setIsDropdownOpen(!isDropdownOpen);
        setIsSortByOpen(false);
        setIsFilterByOpen(false);
        break;
      case "sort":
        setIsSortByOpen(!isSortByOpen);
        setIsDropdownOpen(false);
        setIsFilterByOpen(false);
        break;
      case "filter":
        setIsFilterByOpen(!isFilterByOpen);
        setIsDropdownOpen(false);
        setIsSortByOpen(false);
        break;
      default:
        break;
    }
  };

  const handleLanguageSelect = (language) => {
    setLanguage(language);
  };
  const handleSorting = (sort) => {
    setSort(sort);
  };

  return (
    <section className="p-4 account-bg full-section">
      <ScrollToTop />
      <Row className="mx-md-4" style={{ position: "relative", zIndex: "2" }}>
        <Col className="sorting-options">
          <Dropdown
            className="d-inline-block m-1 user-drop"
            show={isDropdownOpen}
            onToggle={() => handleDropdownToggle("language")}
            style={{ zIndex: "3" }}
          >
            <Dropdown.Toggle
              variant="transparent"
              className="text-white  search-glass "
              style={{ border: "0.5px solid white" }}
              id="language-dropdown"
            >
              <MdLanguage className="mb-1" />{" "}
              {language?.name || "Select Language"}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              {allLanguages?.map((lang) => (
                <Dropdown.Item
                  key={lang?._id}
                  className={`${language?.name === lang?.name ? "active" : ""}`}
                  onClick={() => handleLanguageSelect(lang)}
                >
                  {lang?.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown
            className="d-inline-block m-1 user-drop "
            show={isSortByOpen}
            onToggle={() => handleDropdownToggle("sort")}
            style={{ zIndex: "2" }}
          >
            <Dropdown.Toggle
              variant="transparent"
              className="text-white search-glass text-capitalize"
              style={{ border: "0.5px solid white" }}
              id="sort-dropdown"
            >
              <LuChevronsUpDown className="mb-1" /> {sort || "Sort By"}
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item
                className={`${sort === "latest" ? "active" : ""}`}
                onClick={() => handleSorting("latest")}
              >
                Latest
              </Dropdown.Item>
              <Dropdown.Item
                className={`${sort === "oldest" ? "active" : ""}`}
                onClick={() => handleSorting("oldest")}
              >
                Oldest
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* <Dropdown
            className="d-inline-block m-1"
            show={isFilterByOpen}
            onToggle={() => handleDropdownToggle("filter")}
          >
            <Dropdown.Toggle
              variant="transparent"
              className="text-white search-glass"
              style={{ border: "0.5px solid white" }}
              id="filter-dropdown"
            >
              <MdOutlineTune className="mb-1" /> Filter By
            </Dropdown.Toggle>
            <Dropdown.Menu variant="dark">
              <Dropdown.Item href="#">Option 1</Dropdown.Item>
              <Dropdown.Item href="#">Option 2</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}
        </Col>
      </Row>
      <hr style={{ borderWidth: "3px", color: "rgba(255, 255, 255, 0.5)" }} />

      <Row
        xs={2}
        sm={2}
        md={3}
        lg={4}
        xl={5}
        className="mx-md-4  videos-mapper"
      >
        {videoData?.length > 0
          ? videoData?.map((video, index) => (
              <Col
                key={index}
                className="p-1 d-flex align-items-center justify-content-center"
              >
                <VideoCard
                  video={video}
                  //  loading={isLoading}
                />
              </Col>
            ))
          : null}
      </Row>

      {isLoading ? (
        <Row xs={2} sm={2} md={3} lg={4} xl={5}>
          {[1, 2, 3, 4, 5].map((count, index) => (
            <Col key={index}>
              <Skeleton
                style={{ aspectRatio: "16/9", height: "10rem" }}
                count={1}
              />
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && videoData?.length === 0 ? (
        <Row>
          <Col md={12}>
            <p className="text-white">No data under these search parameters</p>
          </Col>
        </Row>
      ) : null}
    </section>
  );
}

export default VideoCollection;
