import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { useGetGenresQuery } from "../features/api";
import { useMediaQuery } from "react-responsive";

import { useRouter } from "next/navigation";

function HomeSearch() {
  const bg = "bg/akhandbharat2.png";

  const router = useRouter();
  const { data } = useGetGenresQuery();
  const [genre, setGenre] = useState([]);
  // const searchTerms = [
  //     {title: 'Big Expose'},
  //     {title: 'Sanatana Dharma'},
  //     {title: 'Movies'},
  //     {title: 'Series'},
  //     {title: 'Podcasts'},
  //     {title: 'Facts & Truth'},
  // ]
  const isMediumDevice = useMediaQuery({ minWidth: 768 });
  const isLargeDevice = useMediaQuery({ minWidth: 992 });
  const isMobileDevice = useMediaQuery({ minWidth: 600 });

  const [query, setQuery] = useState("");

  useEffect(() => {
    setGenre(data?.genres);
    //  console.log(data);
  }, [data]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?query=${query}`);
  };

  return (
    <section
      className="search-section"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: `${isMediumDevice ? "500px" : "280px"}`,
      }}
    >
      <Container className="py-md-5 py-3" style={{ height: "100%" }}>
        <Row
          style={{ height: "100%" }}
          className="my-5 justify-content-center align-items-center"
        >
          <Col style={{ height: "100%" }} md={8} className="text-center ">
            <h2 className="text-white mb-3 search-title">BHARAT KA OTT</h2>
            <p className=" fw-normal fs-2" style={{ color: "#DCDCDC" }}>
              An initiative to raise the Social, Cultural & Political
              consciousness of{" "}
              <span className="fs-2 fw-bold text-white">BHARAT</span>
            </p>
            <Form className="d-flex my-3 text-white" onSubmit={handleSearch}>
              <InputGroup className="mb- text-white rounded-pill search-glass">
                <InputGroup.Text className="border-0  btn m-0 p-2 ps-md-3">
                  <FiSearch size={isMobileDevice ? 35 : 20} color="#CAA257" />
                </InputGroup.Text>
                <Form.Control
                  type="search"
                  placeholder="Search for Facts & Truth/Series/Podcasts"
                  className=" p-0 p-md-1 text-white search-input border-0"
                  aria-label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  style={{ background: "rgba( 0, 0, 0, 0 )", color: "white" }}
                />
                <InputGroup.Text className="border-0  btn m-0 p-1">
                  <Button
                    variant="transparent"
                    size="lg"
                    type="submit"
                    className="form-btn search-btn rounded-pill text-white px-4 fw-bold"
                  >
                    Search
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Form>

            <div>
              {genre
                ?.filter((term) => term?.name !== "Carousel")
                .map((term, index) => (
                  <Button
                    key={index}
                    size={isLargeDevice ? "lg" : isMediumDevice ? "md" : "sm"}
                    variant="transparent"
                    onClick={() => router.push(`/genre/${term?._id}`)}
                    className="text-white suggest-btn  fw-normal m-md-2 m-1 search-glass"
                  >
                    {term?.name}
                  </Button>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HomeSearch;
