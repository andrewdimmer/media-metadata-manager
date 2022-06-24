// TODO: Figure out how to read from the actual schema.graphql file
// Then remove this file!

export const schemaString = `
  type Tag {
    id: ID!
    name: String!
    type: TagType!
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
