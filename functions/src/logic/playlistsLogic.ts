import { v4 as uuid } from "uuid";
import {
  createPlaylistFirestore,
  deletePlaylistFirestore,
  readPlaylistFirestore,
  updatePlaylistFirestore,
} from "../firebase/playlistsDAO";
import { mediaObjectsQueries } from "../graphql/mediaObjects";
import { tagsQueries } from "../graphql/tags";
import {
  cleanFilterString,
  getMediaObjectIdsMatchingFilter,
  validateFilterStringAndExtractTagIds,
} from "../utils/advancedQueryUtilts";
import {
  diffArrays,
  removeItemFromArray,
  subtractArrays,
  unionArrays,
} from "../utils/arrayUtils";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import { validateStringOrArrayIsNotEmpty } from "../utils/genericValidationUtils";
import {
  addPlaylistToMediaObject,
  removePlaylistFromMediaObject,
} from "./mediaObjectsLogic";
import { addPlaylistToTag, removePlaylistFromTag } from "./tagsLogic";

const generatePlaylistId = () => {
  return `PLAYLIST_${uuid()}`;
};

export const convertPlaylistDataToPlaylist = (
  playlistData: PlaylistData
): Playlist => {
  return {
    ...playlistData,
    tags: tags(playlistData),
    tag: tag(playlistData),
    mediaObjects: mediaObjects(playlistData),
    mediaObject: mediaObject(playlistData),
  };
};

const tags = (playlistData: PlaylistData) => async () => {
  return Promise.all(
    playlistData.tagIds.map((tagId) => {
      return tag(playlistData)({ id: tagId });
    })
  );
};

const tag =
  (playlistData: PlaylistData) =>
  async ({ id }: GraphqlQueryId) => {
    if (!playlistData.tagIds.includes(id)) {
      logAndThrowError(
        `The playlist with id=${playlistData.id} is does not use the tag with id=${id}.`
      );
    }

    return tagsQueries.tag({ id });
  };

const mediaObjects = (playlistData: PlaylistData) => async () => {
  return Promise.all(
    playlistData.mediaObjectIds.map((mediaObjectId) => {
      return mediaObject(playlistData)({ id: mediaObjectId });
    })
  );
};

const mediaObject =
  (playlistData: PlaylistData) =>
  async ({ id }: GraphqlQueryId) => {
    if (!playlistData.mediaObjectIds.includes(id)) {
      logAndThrowError(
        `The playlist with id=${playlistData.id} is does contain the media object with id=${id}.`
      );
    }

    return mediaObjectsQueries.mediaObject({ id });
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
  const cleanFilter = cleanFilterString(input.filter);

  // Handle Tag Updates if required
  const tagIds = await processTags(
    playlistId,
    await validateFilterStringAndExtractTagIds(cleanFilter),
    []
  );

  // Handle Media Object Updates if required
  const mediaObjectIds = await processMediaObjects(
    playlistId,
    await getMediaObjectIdsMatchingFilter(cleanFilter),
    []
  );

  return createPlaylistFirestore({
    id: playlistId,
    ...input,
    filter: cleanFilter,
    tagIds,
    mediaObjectIds,
  });
};

export const updatePlaylistFromInput = async (input: UpdatePlaylistInput) => {
  const existingPlaylist = await readPlaylistFirestore(input.id);

  const inputFilter = input.filter;
  const cleanFilter = inputFilter
    ? cleanFilterString(inputFilter)
    : existingPlaylist.filter;

  // Handle Tag Updates if required
  const tagIds = inputFilter
    ? await processTags(
        input.id,
        await validateFilterStringAndExtractTagIds(cleanFilter),
        existingPlaylist.tagIds
      )
    : existingPlaylist.tagIds;

  // Handle Media Object Updates if required
  const mediaObjectIds = inputFilter
    ? await processMediaObjects(
        input.id,
        await getMediaObjectIdsMatchingFilter(cleanFilter),
        existingPlaylist.mediaObjectIds
      )
    : existingPlaylist.mediaObjectIds;

  const newPlaylist = await updatePlaylistFirestore({
    ...existingPlaylist,
    name: input.name || existingPlaylist.name,
    description: input.description || existingPlaylist.description,
    filter: cleanFilter,
    tagIds,
    mediaObjectIds,
  });

  return newPlaylist;
};

export const deletePlaylistFromInput = async (input: DeletePlaylistInput) => {
  // Handle Data Validation
  validateStringOrArrayIsNotEmpty(input.id, "playlist id");

  const playlistData = await deletePlaylistFirestore(input.id);

  // Propagate Deletion through Tags
  await processTags(input.id, [], playlistData.tagIds);

  // Propagate Deletion through Media Objects
  await processMediaObjects(input.id, [], playlistData.mediaObjectIds);

  return playlistData;
};

export const addMediaObjectToPlaylist = async (
  mediaObjectId: string,
  playlistId: string
) => {
  const playlistData = await readPlaylistFirestore(playlistId);
  if (!playlistData.mediaObjectIds.includes(mediaObjectId)) {
    playlistData.mediaObjectIds.push(mediaObjectId);
  }
  return await updatePlaylistFirestore(playlistData);
};

export const removeMediaObjectFromPlaylist = async (
  mediaObjectId: string,
  playlistId: string
) => {
  const playlistData = await readPlaylistFirestore(playlistId);
  playlistData.mediaObjectIds = removeItemFromArray(
    playlistData.mediaObjectIds,
    mediaObjectId
  );
  return await updatePlaylistFirestore(playlistData);
};

const processTags = async (
  playlistId: string,
  newTagIds: string[],
  oldTagIds: string[]
) => {
  // Get the change of tags used in the filter
  const tagsDiff = diffArrays(oldTagIds, newTagIds);

  // Update the tags that were changed by the change in filter
  await Promise.all(
    tagsDiff.addedItems.map((tagId) => {
      return addPlaylistToTag(playlistId, tagId);
    })
  );
  await Promise.all(
    tagsDiff.deletedItems.map((tagId) => {
      return removePlaylistFromTag(playlistId, tagId);
    })
  );

  return newTagIds;
};

const processMediaObjects = async (
  playlistId: string,
  newMediaObjectIds: string[],
  oldMediaObjectIds: string[]
) => {
  // Get the change of media objects used in the filter
  const mediaObjectsDiff = diffArrays(oldMediaObjectIds, newMediaObjectIds);

  // Update the media objects that were changed by the change in filter
  await Promise.all(
    mediaObjectsDiff.addedItems.map((mediaObjectId) => {
      return addPlaylistToMediaObject(playlistId, mediaObjectId);
    })
  );
  await Promise.all(
    mediaObjectsDiff.deletedItems.map((mediaObjectId) => {
      return removePlaylistFromMediaObject(playlistId, mediaObjectId);
    })
  );

  return unionArrays(
    subtractArrays(oldMediaObjectIds, mediaObjectsDiff.deletedItems),
    mediaObjectsDiff.addedItems
  );
};
