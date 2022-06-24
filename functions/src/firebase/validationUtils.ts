import {
  resourceAlreadyExistsError,
  resourceDoesNotExistsError,
} from "../utils/errorHandlingUtils";

export const validateDocExistsFactory =
  (objectType: string) =>
  (doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) => {
    if (!doc.exists) {
      resourceDoesNotExistsError(objectType, doc.id);
    }
  };

export const validateDocDoesNotExistFactory =
  (objectType: string) =>
  (doc: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData>) => {
    if (doc.exists) {
      resourceAlreadyExistsError(objectType, doc.id);
    }
  };
