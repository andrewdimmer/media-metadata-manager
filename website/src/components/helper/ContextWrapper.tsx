import React, { ReactNode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import CustomThemeProvider from "../../styles/CustomThemeProvider";
import DataManager from "../data/DataManager";
import AlertsManager from "../miscellaneous/alertsManager/AlertsManager";
import LoadingScreen from "../miscellaneous/loadingScreen/LoadingScreen";

// Define a TypeScript Type for the ContextWrapper Props
// Matches declaration of the children props from the React Fragment definition
// Note that the menuAppBar is included in the props as well, so it can be included above context providers that take up screen space.
declare type ContextWrapperProps = {
  menuAppBar?: ReactNode;
  children?: ReactNode | undefined;
};

/**
 * Context Wrapper
 * @description A central class to include all context providers so they can be accessed from anywhere in the website.
 */
const ContextWrapper: React.FunctionComponent<ContextWrapperProps> = ({
  menuAppBar,
  children,
}) => {
  return (
    <CustomThemeProvider>
      <Router>
        <LoadingScreen>
          {menuAppBar}
          <AlertsManager>
            <DataManager>{children}</DataManager>
          </AlertsManager>
        </LoadingScreen>
      </Router>
    </CustomThemeProvider>
  );
};

export default ContextWrapper;
