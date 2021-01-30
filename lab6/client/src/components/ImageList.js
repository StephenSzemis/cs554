import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useQuery, gql } from "@apollo/client";
import ImageCard from "./ImageCard";
import "../App.css";

const GET_IMAGES = gql`
  query unsplashImages($pageNum: Int) {
    unsplashImages(pageNum: $pageNum) {
      id
      url
      description
      posterName
      binned
    }
  }
`;

const ImageList = () => {
  let [pageNum, setPageNum] = useState(1);
  let [results, setResults] = useState([]);
  let { loading, error, data } = useQuery(GET_IMAGES, {
    variables: { pageNum },
  });

  useEffect(() => {
    if (data) {
      let newResults = results.concat(data.unsplashImages);
      setResults(newResults);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.log(error);
    return <div>Error!</div>;
  }

  function onLoadMore() {
    setPageNum(pageNum + 1);
  }

  const buildCard = (image) => {
    return <ImageCard image={image}></ImageCard>;
  };

  const cards = results.map((img) => {
    return buildCard(img);
  });
  return (
    <div>
      <Container>
        <Row>{cards}</Row>
      </Container>
      <button
        onClick={() => {
          onLoadMore();
        }}
      >
        Load More
      </button>
    </div>
  );
};

export default ImageList;
