// TODO: Figure out how to read from the actual schema.graphql file
// Then remove this file!

export const schemaString = `
  type Playlist {
    id: ID!
    type: TagType!
    name: String!
    description: String!
    filter: String!
  }

  input CreatePlaylistInput {
    name: String!
    description: String!
    filter: String!
  }

  input UpdatePlaylistInput {
    id: ID!
    name: String
    description: String
  }

  input DeletePlaylistInput {
    id: ID!
  }
`;
