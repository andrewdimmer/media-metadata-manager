import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { schemaString as rootSchemaString } from "./schema";
import { tagsSchemaString } from "./tags";

const schema = buildSchema(`
  ${rootSchemaString}
  ${tagsSchemaString}
`);

const root = {
  hello: () => "Hello World!",
};

export const graphqlEndpoint = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.FUNCTIONS_EMULATOR == "true",
});
