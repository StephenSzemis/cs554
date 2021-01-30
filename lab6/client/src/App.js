import "./App.css";

import ImageList from "./components/ImageList";
import BinList from "./components/BinList";
import NewPost from "./components/NewPost";
import UserPosts from "./components/UserPosts";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const defaultOptions = {
  watchQuery: {
    fetchPolicy: "no-cache",
    errorPolicy: "ignore",
  },
  query: {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  },
};
const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
  defaultOptions: defaultOptions,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"
        integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk"
        crossorigin="anonymous"
      />
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">Binterest Website! HURRAY!</h1>
            <Link className="imageList" to="/">
              Home
            </Link>
            <br />
            <Link className="binList" to="/my-bin">
              My Bin
            </Link>
            <br />
            <Link className="userPosts" to="/my-posts">
              My Posts
            </Link>
            <br />
            <Link className="newPost" to="/new-post">
              New Post
            </Link>
          </header>
          <br />
          <br />
          <div className="App-body">
            <Route exact path="/" component={ImageList} />
            <Route exact path="/my-bin" component={BinList} />
            <Route exact path="/my-posts" component={UserPosts} />
            <Route exact path="/new-post" component={NewPost} />
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
