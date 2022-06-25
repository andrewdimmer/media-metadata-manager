import {
  logAndThrowError,
  resourceAlreadyExistsError,
  resourceDoesNotExistsError,
} from "../utils/errorHandlingUtils";

export const validateDocExistsFactory =
  <T>(objectType: string, cache: FirestoreCache<T>) =>
  async (
    docReference: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  ) => {
    // Check if the document already exists in the cache; if so, it already exists
    if (!cache.data[docReference.id]) {
      // Check if the document exists in Firestore
      const doc = await docReference.get().catch(logAndThrowError);
      if (!doc.exists) {
        resourceDoesNotExistsError(objectType, doc.id);
      } else {
        const docData = doc.data() as T;
        cache.data[doc.id] = docData; // Update the cache
      }
    }
  };

export const validateDocDoesNotExistFactory =
  <T>(objectType: string, cache: FirestoreCache<T>) =>
  async (
    docReference: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  ) => {
    // Check if the document already exists in the cache; if so, it already exists!
    if (!!cache.data[docReference.id]) {
      resourceAlreadyExistsError(objectType, docReference.id);
    }

    // Check if the document exists in Firestore
    const doc = await docReference.get().catch(logAndThrowError);
    if (doc.exists) {
      const docData = doc.data() as T;
      cache.data[doc.id] = docData; // Update the cache
      resourceAlreadyExistsError(objectType, doc.id);
    }
  };
