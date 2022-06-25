declare interface GraphqlQueryId {
  id: string;
}

declare interface GraphqlMutationInput<T> {
  input: T;
}

declare interface GraphqlRootQueries
  extends GraphqlTagQueries,
    GraphqlMediaObjectQueries {}

declare interface GraphqlRootMutations
  extends GraphqlTagMutations,
    GraphqlMediaObjectMutations {}

declare interface GraphqlRootFunctions
  extends GraphqlRootQueries,
    GraphqlRootMutations {}
