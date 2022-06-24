import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

const schema = buildSchema(`
type Query {
  hello: String
}
`);

const root = {
  hello: () => "Hello World!",
};

export const graphqlEndpoint = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.FUNCTIONS_EMULATOR == "true",
});
