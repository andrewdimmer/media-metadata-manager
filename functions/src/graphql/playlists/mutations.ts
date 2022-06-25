import { logger } from "firebase-functions";
import {
  convertPlaylistDataToPlaylist,
  createPlaylistFromInput,
  deletePlaylistFromInput,
  updatePlaylistFromInput,
} from "../../logic/playlistsLogic";

const createPlaylist = async ({
  input,
}: GraphqlMutationInput<CreatePlaylistInput>): Promise<Playlist> => {
  logger.info(
    `Running Mutation: createPlaylist(input: ${JSON.stringify(input)})`
  );
  const playlistData = await createPlaylistFromInput(input);
  return convertPlaylistDataToPlaylist(playlistData);
};

const updatePlaylist = async ({
  input,
}: GraphqlMutationInput<UpdatePlaylistInput>): Promise<Playlist> => {
  logger.info(
    `Running Mutation: updatePlaylist(input: ${JSON.stringify(input)})`
  );
  const playlistData = await updatePlaylistFromInput(input);
  return convertPlaylistDataToPlaylist(playlistData);
};

const deletePlaylist = async ({
  input,
}: GraphqlMutationInput<DeletePlaylistInput>): Promise<Playlist> => {
  logger.info(
    `Running Mutation: deletePlaylist(input: ${JSON.stringify(input)})`
  );
  const playlistData = await deletePlaylistFromInput(input);
  return convertPlaylistDataToPlaylist(playlistData);
};

export const mutations = {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
};
