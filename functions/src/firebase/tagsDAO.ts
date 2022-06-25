import genericFirebaseDAO from "./genericFirebaseDAO";

const cache: FirestoreCache<TagData> = { data: {}, complete: false };
const tagsDAO = genericFirebaseDAO<TagData>("tag", "tags", cache);

// Generic DAO Functions
export const createTagFirestore = tagsDAO.createDocFirestore;
export const readTagFirestore = tagsDAO.readDocFirestore;
export const listTagsFirestore = tagsDAO.listDocsFirestore;
export const updateTagFirestore = tagsDAO.updateDocFirestore;
export const deleteTagFirestore = tagsDAO.deleteDocFirestore;
