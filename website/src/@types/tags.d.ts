// Interfaces
declare interface Tag {
  id: string;
  name: string;
  type: TagType;
  mediaObjectIds: string[];
  playlistIds: string[];
}

// GraphQL Inputs
declare interface CreateTagInput {
  name: string;
  type?: TagType;
}

declare interface DeleteTagInput {
  id: string;
}

// Enums and Subtypes
declare type TagType = "SPECIAL" | "CREATOR" | "GENRE" | "CUSTOM";

// Front end specific
declare type PseudoTagType = TagType | "ALBUM" | "LINK";

declare interface PseudoTag extends Tag {
  type: PseudoTagType;
  url?: string;
}
