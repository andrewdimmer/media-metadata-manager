// TODO: Figure out how to read from the actual schema.graphql file
// Then remove this file!

export const schemaString = `
  schema {
    query: Query
    mutation: Mutation
  }

  type Query {
    tags: [Tag!]!
    tag(id: ID!): Tag!
    mediaObjects: [MediaObject!]!
    mediaObject(id: ID!): MediaObject!
    playlists: [Playlist!]!
    playlist(id: ID!): Playlist!
  }

  type Mutation {
    createTag(input: CreateTagInput): Tag!
    deleteTag(input: DeleteTagInput): Tag!
    createMediaObject(input: CreateMediaObjectInput): MediaObject!
    updateMediaObject(input: UpdateMediaObjectInput): MediaObject!
    deleteMediaObject(input: DeleteMediaObjectInput): MediaObject!
    createPlaylist(input: CreatePlaylistInput): Playlist!
    updatePlaylist(input: UpdatePlaylistInput): Playlist!
    deletePlaylist(input: DeletePlaylistInput): Playlist!
  }
`;
