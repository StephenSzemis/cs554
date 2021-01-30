import { Container, Row } from "react-bootstrap";
import { useQuery, gql } from "@apollo/client";
import ImageCard from "./ImageCard";
import "../App.css";

const GET_IMAGES = gql`
  query binnedImages {
    binnedImages {
      id
      url
      description
      posterName
      binned
    }
  }
`;

const BinList = () => {
  let { loading, error, data } = useQuery(GET_IMAGES);

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.log(error);
    return <div>Error!</div>;
  }

  console.log(data.binnedImages);

  const buildCard = (image) => {
    return <ImageCard image={image}></ImageCard>;
  };

  const cards = data.binnedImages.map((img) => {
    return buildCard(img);
  });
  return (
    <div>
      <Container>
        <Row>{cards}</Row>
      </Container>
    </div>
  );
};

export default BinList;
