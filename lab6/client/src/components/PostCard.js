import { useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import "../App.css";

const UPDATE_IMAGE = gql`
  mutation updateImage(
    $id: ID!
    $userPosted: Boolean
    $url: String
    $posterName: String
    $description: String
  ) {
    updateImage(
      id: $id
      userPosted: $userPosted
      url: $url
      posterName: $posterName
      description: $description
    ) {
      id
      userPosted
      url
      posterName
      description
    }
  }
`;

const PostCard = (props) => {
  let image = props.image;
  let [updateImage] = useMutation(UPDATE_IMAGE);
  let [info, setInfo] = useState(image);
  useEffect(() => {
    setInfo(image);
  }, [image]);

  let b;
  if (info.userPosted) {
    b = (
      <button
        onClick={() => {
          const new_obj = {
            id: info.id,
            url: info.url,
            posterName: info.posterName,
            description: info.description,
            userPosted: false,
          };
          setInfo(new_obj);
          updateImage({ variables: new_obj });
        }}
      >
        Add back to my posts
      </button>
    );
  } else {
    b = (
      <button
        onClick={() => {
          const new_obj = {
            id: info.id,
            url: info.url,
            posterName: info.posterName,
            description: info.description,
            userPosted: true,
          };
          setInfo(new_obj);
          updateImage({ variables: new_obj });
        }}
      >
        Remove from my posts
      </button>
    );
  }
  return (
    <Col sm={12} md={4} lg={3}>
      <Card>
        <Card.Img variant="bottom" src={info.url}></Card.Img>
        <Card.Body>
          <p>Author: {info.userName}</p>
          <p>Description: {info.description}</p>
          {b}
        </Card.Body>
      </Card>
    </Col>
  );
};

export default PostCard;
