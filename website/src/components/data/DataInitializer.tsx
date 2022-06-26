import React, { Fragment } from "react";
import { v4 as uuid } from "uuid";
import { initializeMediaObjectsCache } from "../../cache/mediaObjectsCache";
import { initializePlaylistsCache } from "../../cache/playlistsCache";
import { initializeTagsCache } from "../../cache/tagsCache";
import { graphqlClient } from "../../config/graphqlClient";
import { initializeAllDataQueryString } from "../../graphql/graphqlQueries";
import AlertsManagerContext from "../miscellaneous/alertsManager/AlertsManagerContext";
import LoadingScreenContext from "../miscellaneous/loadingScreen/LoadingScreenContext";

// Define a TypeScript Type for the DataInitializer Props
declare type DataInitializerProps = {};

// Concurrency lock to prevent duplicate calls
let initialized = false;
let latestRequestTag: string = "";

/**
 * Data Initializer
 * @description A central class to initialize cache data for the website.
 */
const DataInitializer: React.FunctionComponent<DataInitializerProps> = () => {
  const setLoadingMessage =
    React.useContext(LoadingScreenContext).setLoadingMessage;

  const addAlertMessage =
    React.useContext(AlertsManagerContext).addAlertMessage;

  const convertToKeyValuePair = <T extends { id: string }>(data: T[]) => {
    return data.map((item) => {
      return { key: item.id, value: item };
    });
  };

  // Initialize Data
  if (!initialized) {
    initialized = true;
    // The short delay ensures that only one component is updating state at once.
    setTimeout(() => {
      setLoadingMessage("Fetching data...");
      // The short delay ensures only one request is sent.
      const currentRequestTag = uuid();
      latestRequestTag = currentRequestTag;
      setTimeout(() => {
        // Check that the current request is the latest request
        if (currentRequestTag === latestRequestTag) {
          graphqlClient
            .request(initializeAllDataQueryString)
            .then(({ tags, mediaObjects, playlists }) => {
              initializeTagsCache(() => [], convertToKeyValuePair(tags));
              initializeMediaObjectsCache(
                () => [],
                convertToKeyValuePair(mediaObjects)
              );
              initializePlaylistsCache(
                () => [],
                convertToKeyValuePair(playlists)
              );
              addAlertMessage({
                severity: "success",
                title: "Success: Data Initialization Complete",
                message:
                  "All date from the database has been loaded successfully.",
              });
            })
            .catch((error) => {
              console.error(error);
              addAlertMessage({
                severity: "error",
                title: "Error: Unable to Initialize Data",
                message: error,
              });
            })
            .finally(() => {
              // The short delay is to give the components time to render
              setTimeout(() => setLoadingMessage(""), 100);
            });
        }
      }, 100);
    }, 1);
  }

  return <Fragment />;
};

export default DataInitializer;
