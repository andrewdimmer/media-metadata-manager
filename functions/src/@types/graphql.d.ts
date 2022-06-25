declare interface GraphqlQueryId {
  id: string;
}

declare interface GraphqlMutationInput<T> {
  input: T;
}

declare interface GraphqlRootQueries
  extends GraphqlTagQueries,
    GraphqlMediaObjectQueries,
    GraphqlPlaylistQueries {}

declare interface GraphqlRootMutations
  extends GraphqlTagMutations,
    GraphqlMediaObjectMutations,
    GraphqlPlaylistMutations {}

declare interface GraphqlRootFunctions
  extends GraphqlRootQueries,
    GraphqlRootMutations {}
