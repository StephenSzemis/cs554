import { useState, useEffect } from "react";
import { Card, Col } from "react-bootstrap";
import { gql, useMutation } from "@apollo/client";
import "../App.css";

const UPDATE_IMAGE = gql`
  mutation updateImage(
    $id: ID!
    $binned: Boolean
    $url: String
    $posterName: String
    $description: String
  ) {
    updateImage(
      id: $id
      binned: $binned
      url: $url
      posterName: $posterName
      description: $description
    ) {
      id
      binned
      url
      posterName
      description
    }
  }
`;

const ImageCard = (props) => {
  let image = props.image;
  let [updateImage] = useMutation(UPDATE_IMAGE);
  let [info, setInfo] = useState(image);
  useEffect(() => {
    setInfo(image);
  }, [image]);

  let b;
  if (info.binned) {
    b = (
      <button
        onClick={() => {
          const new_obj = {
            id: info.id,
            url: info.url,
            posterName: info.posterName,
            description: info.description,
            binned: false,
          };
          setInfo(new_obj);
          updateImage({ variables: new_obj });
        }}
      >
        Remove from bin
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
            binned: true,
          };
          setInfo(new_obj);
          updateImage({ variables: new_obj });
        }}
      >
        Add to bin
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

export default ImageCard;
