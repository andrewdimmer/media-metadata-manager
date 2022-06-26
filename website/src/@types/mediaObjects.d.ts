// Interfaces
declare interface MediaObject {
  id: string;
  name: string;
  allTagIds: string[];
  creatorTagIds: string[];
  genreTagIds: string[];
  customTagIds: string[];
  specialTagIds: string[];
  externalResources?: MediaObjectExternalResource[];
  sources: MediaObjectSource[];
  playlistIds: string[];
}

// GraphQL Inputs
declare interface CreateMediaObjectInput {
  name: string;
  creatorTagIdsOrNames?: string[];
  genreTagIdsOrNames?: string[];
  customTagIdsOrNames?: string[];
  specialTagIdsOrNames?: string[];
  externalResources?: MediaObjectExternalResource[];
  sources: MediaObjectSource[];
}

declare interface UpdateMediaObjectInput {
  id: string;
  name?: string;
  creatorTagIdsOrNames?: string[];
  genreTagIdsOrNames?: string[];
  customTagIdsOrNames?: string[];
  specialTagIdsOrNames?: string[];
  externalResources?: MediaObjectExternalResource[];
  sources?: MediaObjectSource[];
}

declare interface DeleteMediaObjectInput {
  id: string;
}

// Enums and Subtypes
declare interface MediaObjectExternalResource {
  name: string;
  url: string;
}

declare interface MediaObjectSource {
  type: MediaObjectSourceType;
  source: MediaObjectSourceSource;
  url?: string;
  externalId?: string;
}

declare type MediaObjectSourceType = "VIDEO" | "SONG" | "MUSIC_VIDEO" | "OTHER";

declare type MediaObjectSourceSource = "LINK"; // | PlaylistExternalPlatforms;
