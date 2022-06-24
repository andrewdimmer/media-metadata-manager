declare interface GraphqlQueryId {
  id: string;
}

declare interface GraphqlMutationInput<T> {
  input: T;
}

declare interface GraphqlRootQueries extends GraphqlTagQueries {}

declare interface GraphqlRootMutations extends GraphqlTagMutations {}

declare interface GraphqlRootFunctions
  extends GraphqlRootQueries,
    GraphqlRootMutations {}
