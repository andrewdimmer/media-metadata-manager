import { v4 as uuid } from "uuid";
import {
  createPlaylistFirestore,
  deletePlaylistFirestore,
  readPlaylistFirestore,
  updatePlaylistFirestore,
} from "../firebase/playlistsDAO";
import { validateStringOrArrayIsNotEmpty } from "../utils/genericValidationUtils";

const generatePlaylistId = () => {
  return `PLAYLIST_${uuid()}`;
};

export const convertPlaylistDataToPlaylist = (
  playlistData: PlaylistData
): Playlist => {
  return {
    ...playlistData,
  };
};

export const convertPlaylistDataArrayToPlaylistArray = (
  playlistsData: PlaylistData[]
): Playlist[] => {
  return playlistsData.map((playlistData) => {
    return convertPlaylistDataToPlaylist(playlistData);
  });
};

export const createPlaylistFromInput = async (input: CreatePlaylistInput) => {
  // Handle Data Validation
  validateStringOrArrayIsNotEmpty(input.name, "playlist name");
  validateStringOrArrayIsNotEmpty(input.description, "playlist description");

  const playlistId = generatePlaylistId();
  return createPlaylistFirestore({
    id: playlistId,
    ...input,
  });
};

export const updatePlaylistFromInput = async (input: UpdatePlaylistInput) => {
  const existingPlaylist = await readPlaylistFirestore(input.id);
  const newPlaylist = await updatePlaylistFirestore({
    ...existingPlaylist,
    name: input.name || existingPlaylist.name,
    description: input.description || existingPlaylist.description,
  });

  return newPlaylist;
};

export const deletePlaylistFromInput = async (input: DeletePlaylistInput) => {
  // Handle Data Validation
  validateStringOrArrayIsNotEmpty(input.id, "playlist id");

  const playlistData = await deletePlaylistFirestore(input.id);
  return playlistData;
};
