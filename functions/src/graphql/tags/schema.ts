// TODO: Figure out how to read from the actual schema.graphql file
// Then remove this file!

export const schemaString = `
  type Tag {
    id: ID!
    name: String!
    type: TagType!
    mediaObjectIds: [String!]!
    playlistIds: [ID!]!
    mediaObjects: [MediaObject!]!
    mediaObject(id: ID!): MediaObject!
    playlists: [Playlist!]!
    playlist(id: ID!): Playlist!
  }

  input CreateTagInput {
    name: String!
    type: TagType
  }

  input DeleteTagInput {
    id: ID!
  }

  enum TagType {
    SPECIAL
    CREATOR
    GENRE
    CUSTOM
  }
`;
