import { gql } from "graphql-request";
import {
  mediaObjectReturnFieldsString,
  playlistReturnFieldsString,
  tagReturnFieldsString,
} from "./returnDataFragments";

export const initializeAllDataQueryString = gql`
  query {
    tags {
      ...tagReturnFields
    }
    mediaObjects {
      ...mediaObjectReturnFields
    }
    playlists {
      ...playlistReturnFields
    }
  }

  ${tagReturnFieldsString}
  ${mediaObjectReturnFieldsString}
  ${playlistReturnFieldsString}
`;
