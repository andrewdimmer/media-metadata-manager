import { onIdTokenChanged } from "firebase/auth";
import { GraphQLClient } from "graphql-request";
import {
  firebaseApp,
  firebaseAuth,
  firebaseFunctions,
} from "./firebaseInitialization";

/**
 * The basics of this logic were borrowed from the internal `_url(name)` method in the following file:
 * `/media-metadata-manager/website/node_modules/@firebase/functions/dist/index.esm2017.js
 */
const getFirebaseFunctionsEndpointUrl = (endpointName: string) => {
  const projectId = firebaseApp.options.projectId;
  if (process.env.NODE_ENV !== "production") {
    return `http://localhost:5001/${projectId}/${firebaseFunctions.region}/${endpointName}`;
  }
  if (firebaseFunctions.customDomain !== null) {
    return `${firebaseFunctions.customDomain}/${endpointName}`;
  }
  return `https://${firebaseFunctions.region}-${projectId}.cloudfunctions.net/${endpointName}`;
};

const relativeGraphqlEndpoint = "media_metadata_manager/graphql";
const absoluteGraphqlEndpoint = getFirebaseFunctionsEndpointUrl(
  relativeGraphqlEndpoint
);

export const graphqlClient = new GraphQLClient(absoluteGraphqlEndpoint);

onIdTokenChanged(firebaseAuth, (user) => {
  if (user) {
    // Attach the authorization header when the user logs in or refreshes their token
    user
      .getIdToken()
      .then((token) => {
        graphqlClient.setHeader("authorization", token);
      })
      .catch((error) => {
        // TODO: Standardize error logging
        console.error(error);
      });
  } else {
    // Remove the authorization headers when the user logs out
    graphqlClient.setHeaders({});
  }
});
