import { logger } from "firebase-functions";
import {
  listPlaylistsFirestore,
  readPlaylistFirestore,
} from "../../firebase/playlistsDAO";
import {
  convertPlaylistDataArrayToPlaylistArray,
  convertPlaylistDataToPlaylist,
} from "../../logic/playlistsLogic";
import { validateStringOrArrayIsNotEmpty } from "../../utils/genericValidationUtils";

const playlists = async (): Promise<Playlist[]> => {
  logger.info("Running Query: playlists");
  const playlistsData = await listPlaylistsFirestore();
  return convertPlaylistDataArrayToPlaylistArray(playlistsData);
};

const playlist = async ({ id }: GraphqlQueryId): Promise<Playlist> => {
  logger.info(`Running Query: playlist(id=${id})`);
  validateStringOrArrayIsNotEmpty(id, "playlist id");
  const playlistData = await readPlaylistFirestore(id);
  return convertPlaylistDataToPlaylist(playlistData);
};

export const queries = {
  playlists,
  playlist,
};
