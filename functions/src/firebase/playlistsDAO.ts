import genericFirebaseDAO from "./genericFirebaseDAO";

const playlistsDAO = genericFirebaseDAO<PlaylistData>("playlist", "playlists");

// Generic DAO Functions
export const createPlaylistFirestore = playlistsDAO.createDocFirestore;
export const readPlaylistFirestore = playlistsDAO.readDocFirestore;
export const listPlaylistsFirestore = playlistsDAO.listDocsFirestore;
export const updatePlaylistFirestore = playlistsDAO.updateDocFirestore;
export const deletePlaylistFirestore = playlistsDAO.deleteDocFirestore;
