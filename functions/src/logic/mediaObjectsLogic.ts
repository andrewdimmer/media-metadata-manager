import { v4 as uuid } from "uuid";
import {
  createMediaObjectFirestore,
  deleteMediaObjectFirestore,
  readMediaObjectFirestore,
  updateMediaObjectFirestore,
} from "../firebase/mediaObjectsDAO";
import { playlistsQueries } from "../graphql/playlists";
import { tagsQueries } from "../graphql/tags";
import { checkIfMediaObejctMatchesFilter } from "../utils/advancedQueryUtilts";
import {
  diffArrays,
  removeItemFromArray,
  subtractArrays,
  unionArrayOfArrays,
  unionArrays,
} from "../utils/arrayUtils";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import { validateStringOrArrayIsNotEmpty } from "../utils/genericValidationUtils";
import {
  addMediaObjectToPlaylist,
  removeMediaObjectFromPlaylist,
} from "./playlistsLogic";
import { createNewOrUpdateTags } from "./tagsLogic";

const generateMediaObjectId = () => {
  return `MEDIA_${uuid()}`;
};

export const convertMediaObjectDataToMediaObject = (
  mediaObjectData: MediaObjectData
): MediaObject => {
  const allTagIds = consolidateTagsToSingleArray(mediaObjectData);

  return {
    ...mediaObjectData,
    allTagIds,
    tags: tags(mediaObjectData.id, allTagIds),
    tag: tag(mediaObjectData.id, allTagIds),
    playlists: playlists(mediaObjectData),
    playlist: playlist(mediaObjectData),
  };
};

export const convertMediaObjectDataArrayToMediaObjectArray = (
  mediaObjectsData: MediaObjectData[]
): MediaObject[] => {
  return mediaObjectsData.map((mediaObjectData) => {
    return convertMediaObjectDataToMediaObject(mediaObjectData);
  });
};

const tags = (mediaObjectId: string, allTagIds: string[]) => async () => {
  return Promise.all(
    allTagIds.map((tagId) => {
      return tag(mediaObjectId, allTagIds)({ id: tagId });
    })
  );
};

const tag =
  (mediaObjectId: string, allTagIds: string[]) =>
  async ({ id }: GraphqlQueryId) => {
    if (!allTagIds.includes(id)) {
      logAndThrowError(
        `The media object with id=${mediaObjectId} is not tagged with the tag with id=${id}.`
      );
    }

    return tagsQueries.tag({ id });
  };

const playlists = (mediaObjectData: MediaObjectData) => async () => {
  return Promise.all(
    mediaObjectData.playlistIds.map((playlistId) => {
      return playlist(mediaObjectData)({ id: playlistId });
    })
  );
};

const playlist =
  (mediaObjectData: MediaObjectData) =>
  async ({ id }: GraphqlQueryId) => {
    if (!mediaObjectData.playlistIds.includes(id)) {
      logAndThrowError(
        `The media object with id=${mediaObjectData.id} is not tagged with the tag with id=${id}.`
      );
    }

    return playlistsQueries.playlist({ id });
  };

export const createMediaObjectFromInput = async (
  input: CreateMediaObjectInput
) => {
  const mediaObjectId = generateMediaObjectId();

  // Handle Data Validation
  validateStringOrArrayIsNotEmpty(input.name, "media object name");
  validateStringOrArrayIsNotEmpty(input.sources, "media object sources");
  // TODO: Add Data Validation Here for nested objects

  // Handle Tag Updates or Creation if required
  const { creatorTagIds, genreTagIds, customTagIds, specialTagIds } =
    await processTabs(input, {
      id: mediaObjectId,
      name: "DUMMY",
      creatorTagIds: [],
      genreTagIds: [],
      customTagIds: [],
      specialTagIds: [],
      sources: [],
      playlistIds: [],
    });

  // Handle Playlist Content Population if required
  const playlistIds = await processPlaylists(
    mediaObjectId,
    consolidateTagsToSingleArray({
      creatorTagIds,
      genreTagIds,
      customTagIds,
      specialTagIds,
    }),
    [],
    []
  );

  // Create Media Object
  const newMediaObject = await createMediaObjectFirestore({
    id: mediaObjectId,
    name: input.name,
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
    externalResources: input.externalResources,
    sources: input.sources,
    playlistIds,
  });

  return newMediaObject;
};

export const updateMediaObjectFromInput = async (
  input: UpdateMediaObjectInput
) => {
  const existingMediaObject = await readMediaObjectFirestore(input.id);

  // Handle Data Validation
  // TODO: Add Data Validation Here for nested objects

  // Handle Tag Updates or Creation if required
  const { creatorTagIds, genreTagIds, customTagIds, specialTagIds } =
    await processTabs(input, existingMediaObject);

  // Handle Playlist Content Population if required
  const playlistIds = await processPlaylists(
    input.id,
    consolidateTagsToSingleArray({
      creatorTagIds,
      genreTagIds,
      customTagIds,
      specialTagIds,
    }),
    consolidateTagsToSingleArray(existingMediaObject),
    existingMediaObject.playlistIds
  );

  // Update Media Object
  const newMediaObject = await updateMediaObjectFirestore({
    id: input.id,
    name: input.name || existingMediaObject.name,
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
    externalResources:
      input.externalResources !== undefined
        ? input.externalResources
        : existingMediaObject.externalResources,
    sources: input.sources || existingMediaObject.sources,
    playlistIds,
  });

  return newMediaObject;
};

export const deleteMediaObjectFromInput = async (
  input: DeleteMediaObjectInput
) => {
  // Handle Data Validation
  validateStringOrArrayIsNotEmpty(input.id, "media object id");

  // Delete the Media Object
  const mediaObjectData = await deleteMediaObjectFirestore(input.id);

  // Propagate Deletion through the Tags
  await processTabs(
    {
      id: mediaObjectData.id,
      creatorTagIdsOrNames: [],
      genreTagIdsOrNames: [],
      customTagIdsOrNames: [],
      specialTagIdsOrNames: [],
    },
    mediaObjectData
  );

  // Propagate Deletion through the Playlists
  await processPlaylists(
    input.id,
    [],
    consolidateTagsToSingleArray(mediaObjectData),
    mediaObjectData.playlistIds
  );

  return mediaObjectData;
};

const processTabs = async (
  input: CreateMediaObjectInput | UpdateMediaObjectInput,
  existingMediaObject: MediaObjectData
) => {
  const creatorTagIds = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.creatorTagIdsOrNames,
    existingMediaObject.creatorTagIds,
    "CREATOR"
  );
  const genreTagIds = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.genreTagIdsOrNames,
    existingMediaObject.genreTagIds,
    "GENRE"
  );
  const customTagIds = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.customTagIdsOrNames,
    existingMediaObject.customTagIds,
    "CUSTOM"
  );
  const specialTagIds = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.specialTagIdsOrNames,
    existingMediaObject.specialTagIds,
    "SPECIAL"
  );

  return {
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
  };
};

export const removeTagUponTagDeletion = async (
  mediaObjectId: string,
  tagData: TagData
) => {
  // Get the current information in the media object
  const mediaObjectData = await readMediaObjectFirestore(mediaObjectId);

  // Remove the tag from the correct list
  switch (tagData.type) {
    case "CREATOR":
      mediaObjectData.creatorTagIds = removeItemFromArray(
        mediaObjectData.creatorTagIds,
        tagData.id
      );
      break;
    case "GENRE":
      mediaObjectData.genreTagIds = removeItemFromArray(
        mediaObjectData.genreTagIds,
        tagData.id
      );
      break;
    case "CUSTOM":
      mediaObjectData.customTagIds = removeItemFromArray(
        mediaObjectData.customTagIds,
        tagData.id
      );
      break;
    case "SPECIAL":
      mediaObjectData.specialTagIds = removeItemFromArray(
        mediaObjectData.specialTagIds,
        tagData.id
      );
      break;
    default:
      logAndThrowError(
        "TagType Switch Statement Default - THIS SHOULD NEVER HAPPEN!"
      );
      break;
  }

  // Update the media object
  return await updateMediaObjectFirestore(mediaObjectData);
};

export const addPlaylistToMediaObject = async (
  playlistId: string,
  mediaObjectId: string
) => {
  const mediaObjectData = await readMediaObjectFirestore(mediaObjectId);
  if (!mediaObjectData.playlistIds.includes(playlistId)) {
    mediaObjectData.playlistIds.push(playlistId);
  }
  return await updateMediaObjectFirestore(mediaObjectData);
};

export const removePlaylistFromMediaObject = async (
  playlistId: string,
  mediaObjectId: string
) => {
  const mediaObjectData = await readMediaObjectFirestore(mediaObjectId);
  mediaObjectData.playlistIds = removeItemFromArray(
    mediaObjectData.playlistIds,
    playlistId
  );
  return await updateMediaObjectFirestore(mediaObjectData);
};

export const consolidateTagsToSingleArray = (mediaObjectData: {
  creatorTagIds: string[];
  genreTagIds: string[];
  customTagIds: string[];
  specialTagIds: string[];
}) => {
  return mediaObjectData.creatorTagIds
    .concat(mediaObjectData.genreTagIds)
    .concat(mediaObjectData.customTagIds)
    .concat(mediaObjectData.specialTagIds);
};

const processPlaylists = async (
  mediaObjectId: string,
  newTagIds: string[],
  oldTagIds: string[],
  oldPlaylistIds: string[]
) => {
  // Determine what tags have changed
  // If the tag has not changed, we don't need to check the playlists that use it.
  const tagsDiff = diffArrays(oldTagIds, newTagIds);

  // Get the tag data of added and removed tags
  const tagDataOfAddedItems = tagsDiff.addedItems.map((tagId) => {
    return tagsQueries.tag({ id: tagId });
  });
  const tagDataOfDeletedItems = tagsDiff.deletedItems.map((tagId) => {
    return tagsQueries.tag({ id: tagId });
  });
  const tagDataOfUpdatedItems = await Promise.all(
    tagDataOfAddedItems.concat(tagDataOfDeletedItems)
  );

  // Get and dedup the playlist ids that might have changes
  const playlistIdsRaw = tagDataOfUpdatedItems.map((tagData) => {
    return tagData.playlistIds;
  });
  const playlistIdsDeduped = unionArrayOfArrays(playlistIdsRaw);

  // Get the playlist data for playlists that may have had the media added or delete
  const playlistsThatMightHaveChanged = await Promise.all(
    playlistIdsDeduped.map((playlistId) => {
      return playlistsQueries.playlist({ id: playlistId });
    })
  );

  // Check if the media belongs in any of the playlists that might have changed
  const changedPlaylistIdsContainingMediaObject =
    playlistsThatMightHaveChanged.reduce((playlistIds, playlistData) => {
      if (checkIfMediaObejctMatchesFilter(playlistData.filter, newTagIds)) {
        playlistIds.push(playlistData.id);
      }
      return playlistIds;
    }, [] as string[]);

  // Get the playlistIds that contain the media
  // Definitionally, if the media was in the playlist before, and none of the tags
  // used to filter for the playlist, the media is still in the playlist
  const unchangedPlaylistIds = subtractArrays(
    oldPlaylistIds,
    playlistIdsDeduped
  );
  const newPlaylistIdsWithTheMediaObject = unchangedPlaylistIds.concat(
    changedPlaylistIdsContainingMediaObject
  );

  // Get the change in playlist ids the media is used in
  const playlistsDiff = diffArrays(
    oldPlaylistIds,
    newPlaylistIdsWithTheMediaObject
  );

  // Update the playlist objects as required
  await Promise.all(
    playlistsDiff.addedItems.map((playlistId) => {
      return addMediaObjectToPlaylist(mediaObjectId, playlistId);
    })
  );
  await Promise.all(
    playlistsDiff.deletedItems.map((playlistId) => {
      return removeMediaObjectFromPlaylist(mediaObjectId, playlistId);
    })
  );

  // Update the list of playlist ideas the media is currently in to reflect the addition order
  return unionArrays(
    subtractArrays(oldPlaylistIds, playlistsDiff.deletedItems),
    playlistsDiff.addedItems
  );
};
