// Interfaces
declare interface TagData extends DatabaseNode {
  id: string;
  name: string;
  type: TagType;
}

declare interface Tag extends TagData {}

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

// GraphQL Functions
declare interface GraphqlTagQueries {
  tags: () => Promise<Tag[]>;
  tag: (id: GraphqlQueryId) => Promise<Tag>;
}

declare interface GraphqlTagMutations {
  createTag: (input: GraphqlMutationInput<CreateTagInput>) => Promise<Tag>;
  deleteTag: (input: GraphqlMutationInput<DeleteTagInput>) => Promise<Tag>;
}
