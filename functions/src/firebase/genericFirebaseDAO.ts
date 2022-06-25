import { firebaseFirestore } from "../config/firebaseInitialization";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import {
  validateDocDoesNotExistFactory,
  validateDocExistsFactory,
} from "./validationUtils";
import { logger } from "firebase-functions";

const genericFirebaseDAO = <T extends DatabaseNode>(
  objectType: string,
  collectionName: string
) => {
  const firebaseCollection = firebaseFirestore.collection(collectionName);
  const validateDocExists = validateDocExistsFactory(objectType);
  const validateDocDoesNotExist = validateDocDoesNotExistFactory(objectType);

  const createDocFirestore = async (data: T): Promise<T> => {
    logger.info(`Creating ${objectType} with id=${data.id} in Firestore`);
    const docReference = firebaseCollection.doc(data.id);
    const doc = await docReference.get();
    validateDocDoesNotExist(doc);
    await docReference
      // Clean undefined fields
      // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase
      .set(JSON.parse(JSON.stringify(data)))
      .catch(logAndThrowError);
    return data;
  };

  const readDocFirestore = async (docId: string): Promise<T> => {
    logger.info(`Reading ${objectType} with id=${docId} in Firestore`);
    const doc = await firebaseCollection
      .doc(docId)
      .get()
      .catch(logAndThrowError);
    validateDocExists(doc);
    return doc.data() as T;
  };

  const listDocsFirestore = async (): Promise<T[]> => {
    logger.info(
      `Listing all documents of object type ${objectType} in Firestore`
    );
    const docs = await firebaseCollection.get().catch(logAndThrowError);

    return docs.docs.map((doc) => {
      return doc.data() as T;
    });
  };

  const updateDocFirestore = async (data: T): Promise<T> => {
    logger.info(`Updating ${objectType} with id=${data.id} in Firestore`);
    const docReference = firebaseCollection.doc(data.id);
    const doc = await docReference.get();
    validateDocExists(doc);
    await docReference
      // Clean undefined fields
      // https://stackoverflow.com/questions/42310950/handling-undefined-values-with-firebase
      .update(JSON.parse(JSON.stringify(data)))
      .catch(logAndThrowError);
    return data;
  };

  const deleteDocFirestore = async (docId: string): Promise<T> => {
    logger.info(`Deleting ${objectType} with id=${docId} in Firestore`);
    const data = await readDocFirestore(docId);
    await firebaseCollection.doc(docId).delete().catch(logAndThrowError);
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
