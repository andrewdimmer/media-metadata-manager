import { firebaseFirestore } from "../config/firebaseInitialization";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import {
  validateDocDoesNotExistFactory,
  validateDocExistsFactory,
} from "./validationUtils";

const genericFirebaseDAO = <T extends DatabaseNode>(
  objectType: string,
  collectionName: string
) => {
  const firebaseCollection = firebaseFirestore.collection(collectionName);
  const validateDocExists = validateDocExistsFactory(objectType);
  const validateDocDoesNotExist = validateDocDoesNotExistFactory(objectType);

  const createDocFirestore = async (data: T) => {
    const docReference = firebaseCollection.doc(data.id);
    const doc = await docReference.get();
    validateDocDoesNotExist(doc);
    await docReference.set(data).catch(logAndThrowError);
    return data;
  };

  const readDocFirestore = async (docId: string) => {
    const doc = await firebaseCollection
      .doc(docId)
      .get()
      .catch(logAndThrowError);
    validateDocExists(doc);
    return doc.data() as T;
  };

  const listDocsFirestore = async () => {
    const docs = await firebaseCollection.get().catch(logAndThrowError);

    return docs.docs.map((doc) => {
      return doc.data() as T;
    });
  };

  const updateDocFirestore = async (data: T) => {
    const docReference = firebaseCollection.doc(data.id);
    const doc = await docReference.get();
    validateDocExists(doc);
    await docReference.update(data).catch(logAndThrowError);
    return data;
  };

  const deleteDocFirestore = async (docId: string) => {
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
