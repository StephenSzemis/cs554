import { Container, Row } from "react-bootstrap";
import { useQuery, gql } from "@apollo/client";
import PostCard from "./PostCard";
import "../App.css";

const GET_IMAGES = gql`
  query userPostedImages {
    userPostedImages {
      id
      url
      description
      posterName
      binned
    }
  }
`;

const UserPosts = () => {
  let { loading, error, data } = useQuery(GET_IMAGES);

  if (loading) return <div>Loading...</div>;
  if (error) {
    console.log(error);
    return <div>Error!</div>;
  }

  console.log(data.userPostedImages);

  const buildCard = (image) => {
    if (image) {
      return <PostCard image={image}></PostCard>;
    } else {
      return <div></div>
    }
  };

  const cards = data.userPostedImages.map((img) => {
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

export default UserPosts;
