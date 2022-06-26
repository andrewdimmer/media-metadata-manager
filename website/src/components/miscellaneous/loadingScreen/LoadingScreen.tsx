import { CircularProgress, Grid, styled, Typography } from "@mui/material";
import React, { ReactNode } from "react";
import LoadingScreenContext from "./LoadingScreenContext";

/**
 * Loading Screen Background
 * Create a div element that covers the entire screen.
 * This prevents the user from seeing content (or the lack there of) while the site is loading.
 */
const LoadingScreenBackground = styled("div")(({ theme }) => ({
  width: "100vw",
  height: "100vh",
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1350,
  color: theme.palette.getContrastText(theme.palette.background.default),
  backgroundColor: theme.palette.background.default,
}));

const CircularProgressStyleWrapper = styled("div")(({ theme }) => ({
  margin: theme.spacing(2),
}));

// Define a TypeScript Type for the LoadingScreen Props
// Matches declaration of the children props from the React Fragment definition
declare type LoadingScreenProps = {
  children?: ReactNode | undefined;
};

/**
 * Loading Screen
 * @description A self contained loading screen that covers all other content on the screen while it loads.
 */
const LoadingScreen: React.FunctionComponent<LoadingScreenProps> = ({
  children,
}) => {
  // Creates a state to keep track of the current loading message
  const [loadingMessage, setLoadingMessage] =
    React.useState<string>("Fetching data...");

  return (
    <LoadingScreenContext.Provider value={{ setLoadingMessage }}>
      {loadingMessage && (
        <LoadingScreenBackground>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: "100%", width: "100%" }}
          >
            <Grid item>
              <CircularProgressStyleWrapper>
                <CircularProgress color="primary" />
              </CircularProgressStyleWrapper>
            </Grid>
            <Grid item>
              <Typography variant="h3">{loadingMessage}</Typography>
            </Grid>
          </Grid>
        </LoadingScreenBackground>
      )}
      {children}
    </LoadingScreenContext.Provider>
  );
};

export default LoadingScreen;
