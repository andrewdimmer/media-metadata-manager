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
  }

  type Mutation {
    createTag(input: CreateTagInput): Tag!
    deleteTag(input: DeleteTagInput): Tag!
  }
`;
