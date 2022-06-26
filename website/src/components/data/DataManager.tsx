import React, { ReactNode } from "react";
import DataInitializer from "./DataInitializer";
import DataUpdateHookContext from "./DataUpdateHookContext";

// Define a TypeScript Type for the DataManager Props
// Matches declaration of the children props from the React Fragment definition
declare type DataManagerProps = {
  children?: ReactNode | undefined;
};

/**
 * Data Manager
 * @description A central class to manage the state for when the cache was last updated.
 */
const DataManager: React.FunctionComponent<DataManagerProps> = ({
  children,
}) => {
  const [cacheUpdatedAt, setCacheUpdatedAt] = React.useState<number>(0);

  const dataUpdated = () => {
    setCacheUpdatedAt(Date.now());
  };

  // Use the updatedAt field to eat the "@typescript-eslint/no-unused-vars" error
  (() => cacheUpdatedAt)();

  return (
    <DataUpdateHookContext.Provider value={{ dataUpdated }}>
      <DataInitializer />
      {children}
    </DataUpdateHookContext.Provider>
  );
};

export default DataManager;
