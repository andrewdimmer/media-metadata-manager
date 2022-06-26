import { Fab, styled } from "@mui/material";
import { BugReport as BugReportIcon } from "@mui/icons-material";
import React, { Fragment } from "react";

const BugReportStyleWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom:
    // Extra padding when not in production to go around the Firebase emulator warning.
    process.env.NODE_ENV === "production" ? theme.spacing(2) : theme.spacing(5),
  right: theme.spacing(2),
}));

// To add a little padding to the bottom of the page so the bug report doesn't cover content
// once the user is all the way scrolled down.
const BugReportBottomPadding = styled("div")(({ theme }) => ({
  height: "56px", // It doesn't appear that the FAB is resized for different sized devices.
  marginTop: theme.spacing(2),
  marginBottom:
    // Extra padding when not in production to go around the Firebase emulator warning.
    process.env.NODE_ENV === "production" ? theme.spacing(2) : theme.spacing(5),
}));

declare interface BugReportFabProps {
  githubIssuesUrl: string;
}

const BugReportFab: React.FunctionComponent<BugReportFabProps> = ({
  githubIssuesUrl,
}) => {
  return (
    <Fragment>
      <BugReportStyleWrapper>
        <Fab
          color="primary"
          onClick={() => {
            window.open(githubIssuesUrl, "_blank");
          }}
        >
          <BugReportIcon />
        </Fab>
      </BugReportStyleWrapper>
      <BugReportBottomPadding />
    </Fragment>
  );
};

export default BugReportFab;
