import React from "react";

// Define a TypeScript Type for the DataUpdateHookContext
export declare type DataUpdateHookContextType = {
  dataUpdated: () => void;
};

// Defines a context provider for the alert message information; prevents needing to pass it via props
const DataUpdateHookContext = React.createContext<DataUpdateHookContextType>({
  dataUpdated: () => {
    console.log(
      "No Provider found for the DataUpdateHookContext. Please check this call was from within a Provider."
    );
  },
});

export default DataUpdateHookContext;
