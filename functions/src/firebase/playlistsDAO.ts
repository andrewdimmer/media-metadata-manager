import genericFirebaseDAO from "./genericFirebaseDAO";

const cache: FirestoreCache<PlaylistData> = { data: {}, complete: false };
const playlistsDAO = genericFirebaseDAO<PlaylistData>(
  "playlist",
  "playlists",
  cache
);

// Generic DAO Functions
export const createPlaylistFirestore = playlistsDAO.createDocFirestore;
export const readPlaylistFirestore = playlistsDAO.readDocFirestore;
export const listPlaylistsFirestore = playlistsDAO.listDocsFirestore;
export const updatePlaylistFirestore = playlistsDAO.updateDocFirestore;
export const deletePlaylistFirestore = playlistsDAO.deleteDocFirestore;
