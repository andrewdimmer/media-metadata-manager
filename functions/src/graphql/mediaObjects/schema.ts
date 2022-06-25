// TODO: Figure out how to read from the actual schema.graphql file
// Then remove this file!

export const schemaString = `
  type MediaObject {
    id: ID!
    name: String!
    creatorTagIds: [String!]!
    genreTagIds: [String!]!
    customTagIds: [String!]!
    specialTagIds: [String!]!
    externalResources: [MediaObjectExternalResouce!]
    sources: [MediaObjectSource!]!
    tags: [Tag!]!
    tag(id: ID!): Tag!
  }

  type MediaObjectExternalResouce {
    name: String!
    url: String!
  }

  type MediaObjectSource {
    type: MediaObjectSourceType!
    source: MediaObjectSourceSource!
    url: String
    externalId: String
  }

  input CreateMediaObjectInput {
    name: String!
    creatorTagIdsOrNames: [String!]
    genreTagIdsOrNames: [String!]
    customTagIdsOrNames: [String!]
    specialTagIdsOrNames: [String!]
    externalResources: [MediaObjectExternalResouceInput!]
    sources: [MediaObjectSourceInput!]!
  }

  input UpdateMediaObjectInput {
    id: ID!
    name: String
    creatorTagIdsOrNames: [String!]
    genreTagIdsOrNames: [String!]
    customTagIdsOrNames: [String!]
    specialTagIdsOrNames: [String!]
    externalResources: [MediaObjectExternalResouceInput!]
    sources: [MediaObjectSourceInput!]
  }

  input DeleteMediaObjectInput {
    id: ID!
  }

  input MediaObjectExternalResouceInput {
    name: String!
    url: String!
  }

  input MediaObjectSourceInput {
    type: MediaObjectSourceType!
    source: MediaObjectSourceSource!
    url: String
    externalId: String
  }

  enum MediaObjectSourceType {
    VIDEO
    SONG
    MUSIC_VIDEO
    OTHER
  }

  enum MediaObjectSourceSource {
    LINK
  }
`;
