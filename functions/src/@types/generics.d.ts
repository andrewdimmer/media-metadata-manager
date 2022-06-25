declare interface DatabaseNode {
  id: string;
}

declare interface FirestoreCache<T> {
  data: { [key: string]: T | undefined };
  complete: boolean;
}
