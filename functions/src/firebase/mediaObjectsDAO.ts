import genericFirebaseDAO from "./genericFirebaseDAO";

const cache: FirestoreCache<MediaObjectData> = { data: {}, complete: false };
const mediaObjectsDAO = genericFirebaseDAO<MediaObjectData>(
  "media object",
  "media",
  cache
);

// Generic DAO Functions
export const createMediaObjectFirestore = mediaObjectsDAO.createDocFirestore;
export const readMediaObjectFirestore = mediaObjectsDAO.readDocFirestore;
export const listMediaObjectsFirestore = mediaObjectsDAO.listDocsFirestore;
export const updateMediaObjectFirestore = mediaObjectsDAO.updateDocFirestore;
export const deleteMediaObjectFirestore = mediaObjectsDAO.deleteDocFirestore;
