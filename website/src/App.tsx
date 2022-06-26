import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { gql } from "graphql-request";
import { graphqlClient } from "./config/graphqlClient";
import CustomThemeProvider from "./styles/CustomThemeProvider";
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
    <CustomThemeProvider>
      <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a className="App-link" href="https://reactjs.org" target="_blank">
            Learn React
          </a>
        </header>
      </div>
    </CustomThemeProvider>
  );
}

export default App;
