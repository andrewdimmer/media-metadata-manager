import { Container } from "@mui/material";
// import { gql } from "graphql-request";
import ContextWrapper from "./components/helper/ContextWrapper";
import PageRouter from "./components/helper/PageRouter";
import MenuAppBar from "./components/layout/MenuAppBar";
import BugReportFab from "./components/miscellaneous/BugReportFab";
// import { graphqlClient } from "./config/graphqlClient";

/* graphqlClient
  .request(
    gql`
      {
        hello
      }
    `
  )
  .then((value) => console.log(value))
  .catch((error) => console.warn(error)); */

const App: React.FunctionComponent = () => {
  return (
    <ContextWrapper menuAppBar={<MenuAppBar title="Media Metadata Manager" />}>
      <Container>
        <PageRouter />
      </Container>
      <BugReportFab githubIssuesUrl="https://github.com/andrewdimmer/media-metadata-manager/issues/" />
    </ContextWrapper>
  );
};

export default App;
