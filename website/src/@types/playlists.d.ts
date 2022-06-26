// Interfaces
declare interface Playlist {
  id: string;
  name: string;
  description: string;
  filter: string;
  tagIds: string[];
  mediaObjectIds: string[];
}

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
  filter?: string;
}

declare interface DeletePlaylistInput {
  id: string;
}
