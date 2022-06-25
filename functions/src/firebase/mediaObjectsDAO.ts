import genericFirebaseDAO from "./genericFirebaseDAO";

const mediaObjectsDAO = genericFirebaseDAO<MediaObjectData>(
  "media object",
  "media"
);

// Generic DAO Functions
export const createMediaObjectFirestore = mediaObjectsDAO.createDocFirestore;
export const readMediaObjectFirestore = mediaObjectsDAO.readDocFirestore;
export const listMediaObjectsFirestore = mediaObjectsDAO.listDocsFirestore;
export const updateMediaObjectFirestore = mediaObjectsDAO.updateDocFirestore;
export const deleteMediaObjectFirestore = mediaObjectsDAO.deleteDocFirestore;
