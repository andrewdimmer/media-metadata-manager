import { Container } from "@mui/material";
import { gql } from "graphql-request";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MenuAppBar from "./components/layout/MenuAppBar";
import { graphqlClient } from "./config/graphqlClient";
import Error404Page from "./pages/Error404Page";
import HomePage from "./pages/Home";
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
      <Router>
        <MenuAppBar title="Media Metadata Manager" />
        <Container>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<Error404Page />} />
          </Routes>
        </Container>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;
