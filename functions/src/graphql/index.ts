import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import {
  mediaObjectsMutations,
  mediaObjectsQueries,
  mediaObjectsSchemaString,
} from "./mediaObjects";
import {
  playlistsMutations,
  playlistsQueries,
  playlistsSchemaString,
} from "./playlists";
import { schemaString as rootSchemaString } from "./schema";
import { tagsMutations, tagsQueries, tagsSchemaString } from "./tags";

const schema = buildSchema(`
  ${rootSchemaString}
  ${tagsSchemaString}
  ${mediaObjectsSchemaString}
  ${playlistsSchemaString}
`);

const root: GraphqlRootFunctions = {
  ...tagsQueries,
  ...tagsMutations,
  ...mediaObjectsQueries,
  ...mediaObjectsMutations,
  ...playlistsQueries,
  ...playlistsMutations,
};

export const graphqlEndpoint = graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: process.env.FUNCTIONS_EMULATOR == "true",
});
