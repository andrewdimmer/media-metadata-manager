import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { gql } from "graphql-request";
import { graphqlClient } from "./config/graphqlClient";
graphqlClient
  .request(
    gql`
      {
        hello
      }
    `
  )
  .then((value) => console.log(value))
  .catch((error) => console.warn(error));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
