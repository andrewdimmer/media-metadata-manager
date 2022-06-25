// Interfaces
declare interface MediaObjectData extends DatabaseNode {
  id: string;
  name: string;
  creatorTagIds: string[];
  genreTagIds: string[];
  customTagIds: string[];
  specialTagIds: string[];
  externalResources?: MediaObjectExternalResource[];
  sources: MediaObjectSource[];
}

declare interface MediaObject extends MediaObjectData {
  tags: () => Promise<Tag[]>;
  tag: (id: GraphqlQueryId) => Promise<Tag>;
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

// GraphQL Functions
declare interface GraphqlMediaObjectQueries {
  mediaObjects: () => Promise<MediaObject[]>;
  mediaObject: (id: GraphqlQueryId) => Promise<MediaObject>;
}

declare interface GraphqlMediaObjectMutations {
  createMediaObject: (
    input: GraphqlMutationInput<CreateMediaObjectInput>
  ) => Promise<MediaObject>;
  updateMediaObject: (
    input: GraphqlMutationInput<UpdateMediaObjectInput>
  ) => Promise<MediaObject>;
  deleteMediaObject: (
    input: GraphqlMutationInput<DeleteMediaObjectInput>
  ) => Promise<MediaObject>;
}
