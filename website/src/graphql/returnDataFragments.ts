import { gql } from "graphql-request";

export const tagReturnFieldsString = gql`
  fragment tagReturnFields on Tag {
    id
    name
    type
    mediaObjectIds
    playlistIds
  }
`;

export const mediaObjectReturnFieldsString = gql`
  fragment mediaObjectReturnFields on MediaObject {
    id
    name
    allTagIds
    creatorTagIds
    genreTagIds
    customTagIds
    specialTagIds
    externalResources {
      name
      url
    }
    sources {
      type
      source
      url
      externalId
    }
    playlistIds
  }
`;

export const playlistReturnFieldsString = gql`
  fragment playlistReturnFields on Playlist {
    id
    name
    description
    filter
    tagIds
    mediaObjectIds
  }
`;
