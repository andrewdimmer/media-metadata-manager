import { v4 as uuid } from "uuid";
import {
  createMediaObjectFirestore,
  deleteMediaObjectFirestore,
  readMediaObjectFirestore,
  updateMediaObjectFirestore,
} from "../firebase/mediaObjectsDAO";
import { readTagFirestore } from "../firebase/tagsDAO";
import { removeItemFromList } from "../utils/arrayUtils";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import { convertTagDataToTag, createNewOrUpdateTags } from "./tagsLogic";

const generateMediaObjectId = () => {
  return `MEDIA_${uuid()}`;
};

export const convertMediaObjectDataToMediaObject = (
  mediaObjectData: MediaObjectData,
  cachedTabs?: TagData[]
): MediaObject => {
  const tagIds = mediaObjectData.creatorTagIds
    .concat(mediaObjectData.genreTagIds)
    .concat(mediaObjectData.customTagIds)
    .concat(mediaObjectData.specialTagIds);

  return {
    ...mediaObjectData,
    tags: tags(mediaObjectData.id, tagIds, cachedTabs),
    tag: tag(mediaObjectData.id, tagIds, cachedTabs),
  };
};

export const convertMediaObjectDataArrayToMediaObjectArray = (
  mediaObjectsData: MediaObjectData[],
  cachedTabs?: TagData[]
): MediaObject[] => {
  return mediaObjectsData.map((mediaObjectData) => {
    return convertMediaObjectDataToMediaObject(mediaObjectData, cachedTabs);
  });
};

const tags =
  (mediaObjectId: string, tagIds: string[], cachedTabs?: TagData[]) =>
  async () => {
    return Promise.all(
      tagIds.map((tagId) => {
        return tag(mediaObjectId, tagIds, cachedTabs)({ id: tagId });
      })
    );
  };

const tag =
  (mediaObjectId: string, tagIds: string[], cachedTabs?: TagData[]) =>
  async ({ id }: GraphqlQueryId) => {
    if (!tagIds.includes(id)) {
      logAndThrowError(
        `The media object with id=${mediaObjectId} is not tagged with the tag with id=${id}`
      );
    }

    const tagData =
      cachedTabs?.find((tagData) => {
        return tagData.id === id;
      }) || (await readTagFirestore(id));

    return convertTagDataToTag(tagData);
  };

export const createMediaObjectFromInput = async (
  input: CreateMediaObjectInput
) => {
  const mediaObjectId = generateMediaObjectId();

  // Handle Tag Updates or Creation if required
  const {
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
    cachedTabs,
  } = await processTabs(input, {
    id: mediaObjectId,
    name: "DUMMY",
    creatorTagIds: [],
    genreTagIds: [],
    customTagIds: [],
    specialTagIds: [],
    sources: [],
  });

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
  });

  return { mediaObjectData: newMediaObject, cachedTabs };
};

export const updateMediaObjectFromInput = async (
  input: UpdateMediaObjectInput
) => {
  const existingMediaObject = await readMediaObjectFirestore(input.id);

  // Handle Tag Updates or Creation if required
  const {
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
    cachedTabs,
  } = await processTabs(input, existingMediaObject);

  // Update Media Object
  const newMediaObject = await updateMediaObjectFirestore({
    id: input.id,
    name: input.name || existingMediaObject.name,
    creatorTagIds,
    genreTagIds,
    customTagIds,
    specialTagIds,
    externalResources:
      input.externalResources || existingMediaObject.externalResources,
    sources: input.sources || existingMediaObject.sources,
  });

  return { mediaObjectData: newMediaObject, cachedTabs };
};

export const deleteMediaObjectFromInput = async (
  input: DeleteMediaObjectInput
) => {
  // Delete the Media Object
  const mediaObjectData = await deleteMediaObjectFirestore(input.id);

  // Propagate Deletion through the Tags
  const { cachedTabs } = await processTabs(
    {
      id: mediaObjectData.id,
      creatorTagIdsOrNames: [],
      genreTagIdsOrNames: [],
      customTagIdsOrNames: [],
      specialTagIdsOrNames: [],
    },
    mediaObjectData
  );

  return { mediaObjectData, cachedTabs };
};

const processTabs = async (
  input: CreateMediaObjectInput | UpdateMediaObjectInput,
  existingMediaObject: MediaObjectData
) => {
  const creatorTagIdsAndCache = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.creatorTagIdsOrNames,
    existingMediaObject.creatorTagIds,
    "CREATOR"
  );
  const genreTagIdsAndCache = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.genreTagIdsOrNames,
    existingMediaObject.genreTagIds,
    "GENRE"
  );
  const customTagIdsAndCache = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.customTagIdsOrNames,
    existingMediaObject.customTagIds,
    "CUSTOM"
  );
  const specialTagIdsAndCache = await createNewOrUpdateTags(
    existingMediaObject.id,
    input.specialTagIdsOrNames,
    existingMediaObject.specialTagIds,
    "SPECIAL"
  );

  return {
    creatorTagIds: creatorTagIdsAndCache.tagIds,
    genreTagIds: genreTagIdsAndCache.tagIds,
    customTagIds: customTagIdsAndCache.tagIds,
    specialTagIds: specialTagIdsAndCache.tagIds,
    cachedTabs: creatorTagIdsAndCache.tagsData
      .concat(genreTagIdsAndCache.tagsData)
      .concat(customTagIdsAndCache.tagsData)
      .concat(specialTagIdsAndCache.tagsData),
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
      mediaObjectData.creatorTagIds = removeItemFromList(
        mediaObjectData.creatorTagIds,
        tagData.id
      );
      break;
    case "GENRE":
      mediaObjectData.genreTagIds = removeItemFromList(
        mediaObjectData.genreTagIds,
        tagData.id
      );
      break;
    case "CUSTOM":
      mediaObjectData.customTagIds = removeItemFromList(
        mediaObjectData.customTagIds,
        tagData.id
      );
      break;
    case "SPECIAL":
      mediaObjectData.specialTagIds = removeItemFromList(
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
