import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import "../App.css";

const UPLOAD_IMAGE = gql`
  mutation uploadImage(
    $url: String!
    $posterName: String
    $description: String
  ) {
    uploadImage(url: $url, posterName: $posterName, description: $description) {
      id
    }
  }
`;

const NewPost = () => {
  let [uploadImage] = useMutation(UPLOAD_IMAGE);
  let [PosterName, setPosterName] = useState("");
  let [URL, setURL] = useState("");
  let [Description, setDescription] = useState("");

  function onSubmit (e) {
    e.preventDefault();
    console.log('PosterName:', PosterName);
    console.log('URL:', URL);
    console.log('Description:', Description);
    uploadImage({
      variables: {
        postName: PosterName,
        url: URL,
        description: Description,
      },
    });
    setPosterName("");
    setURL("");
    setDescription("");
  }

  const handleURL = event => {
    setURL(event.target.value);  
  };

  const handlePosterName= event => {
    setPosterName(event.target.value);  
  };

  const handleDescription = event => {
    setDescription(event.target.value);  
  };

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group controlId="URL">
        <Form.Label>URL</Form.Label>
        <Form.Control type="text" onChange={handleURL}></Form.Control>
      </Form.Group>
      <Form.Group controlId="PosterName">
        <Form.Label>Poster Name</Form.Label>
        <Form.Control type="text" onChange={handlePosterName}></Form.Control>
      </Form.Group>
      <Form.Group controlId="Description">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" onChange={handleDescription}></Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default NewPost;
