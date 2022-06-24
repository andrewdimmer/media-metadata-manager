declare interface TagData extends DatabaseNode {
  id: string;
  name: string;
  type: TagType;
}

declare interface Tag extends TagData {}

declare type CreateTagInput = {
  name: string;
  type?: TagType;
};

declare type DeleteTagInput = {
  id: string;
};

declare type TagType = "SPECIAL" | "CREATOR" | "GENRE" | "CUSTOM";

declare interface GraphqlTagQueries {
  tags: () => Promise<Tag[]>;
  tag: (id: GraphqlQueryId) => Promise<Tag>;
}

declare interface GraphqlTagMutations {
  createTag: (input: GraphqlMutationInput<CreateTagInput>) => Promise<Tag>;
  deleteTag: (input: GraphqlMutationInput<DeleteTagInput>) => Promise<Tag>;
}
