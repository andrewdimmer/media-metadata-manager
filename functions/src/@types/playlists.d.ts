// Interfaces
declare interface PlaylistData extends DatabaseNode {
  id: string;
  name: string;
  description: string;
  filter: string;
  // externalOutputs: PlaylistExternalOutputObject[];
}

declare interface Playlist extends PlaylistData {}

// GraphQL Inputs
declare interface CreatePlaylistInput {
  name: string;
  description: string;
  filter: string;
}

declare interface UpdatePlaylistInput {
  id: string;
  name?: string;
  description?: string;
  // filter?: string; // TODO: Support Filter Updates Later
}

declare interface DeletePlaylistInput {
  id: string;
}

// Enums and Subtypes
/* declare interface PlaylistExternalOutputObject {
  platform: PlaylistExternalPlatforms;
  externalId?: string;
  url?: string;
}

declare type PlaylistExternalPlatforms = ""; */

// GraphQL Functions
declare interface GraphqlPlaylistQueries {
  playlists: () => Promise<Playlist[]>;
  playlist: (id: GraphqlQueryId) => Promise<Playlist>;
}

declare interface GraphqlPlaylistMutations {
  createPlaylist: (
    input: GraphqlMutationInput<CreatePlaylistInput>
  ) => Promise<Playlist>;
  updatePlaylist: (
    input: GraphqlMutationInput<UpdatePlaylistInput>
  ) => Promise<Playlist>;
  deletePlaylist: (
    input: GraphqlMutationInput<DeletePlaylistInput>
  ) => Promise<Playlist>;
}
