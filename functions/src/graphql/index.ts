import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { schemaString as rootSchemaString } from "./schema";
import { tagsMutations, tagsQueries, tagsSchemaString } from "./tags";

const schema = buildSchema(`
  ${rootSchemaString}
  ${tagsSchemaString}
`);

const root: GraphqlRootFunctions = {
  ...tagsQueries,
  ...tagsMutations,
};

export const graphqlEndpoint = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.FUNCTIONS_EMULATOR == "true",
});
