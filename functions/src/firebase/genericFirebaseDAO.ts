import { logger } from "firebase-functions";
import { firebaseFirestore } from "../config/firebaseInitialization";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import {
  validateDocDoesNotExistFactory,
  validateDocExistsFactory,
} from "./validationUtils";

const genericFirebaseDAO = <T extends DatabaseNode>(
  objectType: string,
  collectionName: string,
  cache: FirestoreCache<T>
) => {
  const firebaseCollection = firebaseFirestore.collection(collectionName);
  const validateDocExists = validateDocExistsFactory(objectType, cache);
  const validateDocDoesNotExist = validateDocDoesNotExistFactory(
    objectType,
    cache
  );

  const createDocFirestore = async (data: T): Promise<T> => {
    logger.info(`Creating ${objectType} with id=${data.id} in Firestore.`);
    const docReference = firebaseCollection.doc(data.id);
    await validateDocDoesNotExist(docReference);
    await docReference
      // Clean undefined fields
      // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase
      .set(JSON.parse(JSON.stringify(data)))
      .catch(logAndThrowError);
    cache.data[data.id] = data; // Update the cache
    return data;
  };

  const readDocFirestore = async (docId: string): Promise<T> => {
    const cachedData = cache.data[docId];
    if (cachedData !== undefined) {
      // Cache Hit
      logger.info(`Reading ${objectType} with id=${docId} from cache.`);
      return cachedData;
    } else {
      // Cache Miss
      logger.info(`Reading ${objectType} with id=${docId} from Firestore.`);
      const docReference = await firebaseCollection.doc(docId);
      await validateDocExists(docReference);
      // Provided validation does not fail, the doc is now in the cache due to getting it during validation
      return cache.data[docId] as T;
    }
  };

  const listDocsFirestore = async (): Promise<T[]> => {
    if (cache.complete) {
      // Cache already contains the full list of all documents
      logger.info(
        `Listing all documents of object type ${objectType} in cache.`
      );
      const docIds = Object.keys(cache.data);
      return docIds.map((docId) => {
        return cache.data[docId] as T; // The cache always contains a document if the key exists
      });
    } else {
      // Cache does not already contain the full list
      logger.info(
        `Listing all documents of object type ${objectType} in Firestore.`
      );
      cache.complete = true;
      const docs = await firebaseCollection.get().catch(logAndThrowError);

      return docs.docs.map((doc) => {
        const docData = doc.data() as T;
        cache.data[doc.id] = docData; // Update the cache
        return docData;
      });
    }
  };

  const updateDocFirestore = async (data: T): Promise<T> => {
    logger.info(`Updating ${objectType} with id=${data.id} in Firestore.`);
    const docReference = firebaseCollection.doc(data.id);
    await validateDocExists(docReference);
    await docReference
      // Clean undefined fields
      // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase
      .update(JSON.parse(JSON.stringify(data)))
      .catch(logAndThrowError);
    cache.data[data.id] = data; // Update the cache
    return data;
  };

  const deleteDocFirestore = async (docId: string): Promise<T> => {
    logger.info(`Deleting ${objectType} with id=${docId} in Firestore.`);
    const data = await readDocFirestore(docId); // Validation occurs here
    await firebaseCollection.doc(docId).delete().catch(logAndThrowError);
    delete cache.data[docId]; // Remove from the cache
    return data;
  };

  return {
    createDocFirestore,
    readDocFirestore,
    listDocsFirestore,
    updateDocFirestore,
    deleteDocFirestore,
  };
};

export default genericFirebaseDAO;
