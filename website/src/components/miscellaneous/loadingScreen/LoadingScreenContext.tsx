import React from "react";

// Define a TypeScript Type for the LoadingScreenContext
export declare interface LoadingScreenContextType {
  setLoadingMessage: (loadingMessage: string) => void;
}

// Defines a context provider for the loading information; prevents needing to pass it via props
const LoadingScreenContext = React.createContext<LoadingScreenContextType>({
  setLoadingMessage: () => {
    "No Provider found for the LoadingScreenContext. Please check this call was from within a Provider.";
  },
});

export default LoadingScreenContext;
