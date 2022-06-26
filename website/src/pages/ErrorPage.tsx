import { Typography } from "@mui/material";
import React, { Fragment } from "react";

// Define a TypeScript Type for the ErrorPage Props
declare interface ErrorPageProps {
  errorCode?: number;
  errorMessage: string;
  errorDescription?: string;
}

// Define a Common Error Page Component
const ErrorPage: React.FunctionComponent<ErrorPageProps> = ({
  errorCode,
  errorMessage,
  errorDescription,
}) => {
  return (
    <Fragment>
      <Typography variant="h3">
        Error{errorCode !== undefined ? ` ${errorCode}` : ""}!
      </Typography>
      <Typography variant="h4">{errorMessage}</Typography>
      {errorDescription && (
        <Typography variant="body1">{errorDescription}</Typography>
      )}
    </Fragment>
  );
};

export default ErrorPage;
