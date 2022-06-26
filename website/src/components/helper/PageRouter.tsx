import React, { ReactNode } from "react";
import { Route, Routes } from "react-router-dom";
import Error404Page from "../../pages/Error404Page";
import HomePage from "../../pages/Home";

// Define a TypeScript Type for the PageRouter Props
// Matches declaration of the children props from the React Fragment definition
declare type PageRouterProps = {
  children?: ReactNode | undefined;
};

/**
 * Page Router
 * @description A central class to handle page routing on the website.
 */
const PageRouter: React.FunctionComponent<PageRouterProps> = ({ children }) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
};

export default PageRouter;
