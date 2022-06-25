import { readMediaObjectFirestore } from "../firebase/mediaObjectsDAO";
import {
  createTagFirestore,
  deleteTagFirestore,
  readTagFirestore,
  updateTagFirestore,
} from "../firebase/tagsDAO";
import { removeItemFromList } from "../utils/arrayUtils";
import { logAndThrowError } from "../utils/errorHandlingUtils";
import {
  convertMediaObjectDataToMediaObject,
  removeTagUponTagDeletion,
} from "./mediaObjectsLogic";

const generateTagId = (tagName: string, tagType: TagType) => {
  const sanitizedName = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `TAG_${tagType}_${sanitizedName}`;
};

export const convertTagDataToTag = (tagData: TagData): Tag => {
  return {
    ...tagData,
    mediaObjects: mediaObjects(tagData),
    mediaObject: mediaObject(tagData),
  };
};

export const convertTagDataArrayToTagArray = (tagsData: TagData[]): Tag[] => {
  return tagsData.map((tagData) => {
    return convertTagDataToTag(tagData);
  });
};

const mediaObjects = (tagData: TagData) => async () => {
  return Promise.all(
    tagData.mediaObjectIds.map((mediaObjectId) => {
      return mediaObject(tagData)({ id: mediaObjectId });
    })
  );
};

const mediaObject =
  (tagData: TagData) =>
  async ({ id }: GraphqlQueryId) => {
    if (!tagData.mediaObjectIds.includes(id)) {
      logAndThrowError(
        `The tag with id=${tagData.id} is not on the media object with id=${id}`
      );
    }

    const mediaObjectData = await readMediaObjectFirestore(id);
    return convertMediaObjectDataToMediaObject(mediaObjectData);
  };

export const createTagFromInput = async (input: CreateTagInputInternal) => {
  const tagName = input.name.trim();
  const tagType = input.type || "CUSTOM";
  const mediaObjectIds = input.mediaObjectIds || [];
  return createTagFirestore({
    id: generateTagId(tagName, tagType),
    name: tagName,
    type: tagType,
    mediaObjectIds,
  });
};

export const deleteTagFromInput = async (input: DeleteTagInput) => {
  const tagData = await deleteTagFirestore(input.id);

  // Propagate Deletion through Media Objects
  await Promise.all(
    tagData.mediaObjectIds.map((mediaObjectId) => {
      return removeTagUponTagDeletion(mediaObjectId, tagData);
    })
  );

  return tagData;
};

const addMediaObjectToTag = async (mediaObjectId: string, tagId: string) => {
  const tagData = await readTagFirestore(tagId);
  if (!tagData.mediaObjectIds.includes(mediaObjectId)) {
    tagData.mediaObjectIds.push(mediaObjectId);
  }
  return await updateTagFirestore(tagData);
};

const removeMediaObjectFromTag = async (
  mediaObjectId: string,
  tagId: string
) => {
  const tagData = await readTagFirestore(tagId);
  tagData.mediaObjectIds = removeItemFromList(
    tagData.mediaObjectIds,
    mediaObjectId
  );
  return await updateTagFirestore(tagData);
};

export const createNewOrUpdateTags = async (
  mediaObjectId: string,
  newTagIdsOrNames: string[] | undefined,
  existingTagIds: string[],
  tagType: TagType
) => {
  // Short circuit if no new tags are provided
  if (newTagIdsOrNames === undefined) {
    return existingTagIds;
  }

  // Perform tag type validation
  newTagIdsOrNames.map((tagIdOrName) => {
    if (
      tagIdOrName.indexOf("TAG_") === 0 &&
      tagIdOrName.indexOf(`TAG_${tagType}_`) !== 0
    ) {
      logAndThrowError(
        `The tag with id=${tagIdOrName} is not of type=${tagType}`
      );
    }
    return tagIdOrName;
  });

  // Perform tag appends or creation
  const tagIds: string[] = [];
  await Promise.all(
    newTagIdsOrNames.reduce((output, tagIdOrName) => {
      if (tagIdOrName.indexOf("TAG_") === 0) {
        // Tag Id; need to (maybe) update (assume already exists)
        tagIds.push(tagIdOrName);
        if (!existingTagIds.includes(tagIdOrName)) {
          output.push(addMediaObjectToTag(mediaObjectId, tagIdOrName));
        }
      } else {
        // Tag Name; need to create new (assume does not exist)
        tagIds.push(generateTagId(tagIdOrName, tagType));
        const tagData = createTagFromInput({
          name: tagIdOrName,
          type: tagType,
          mediaObjectIds: [mediaObjectId],
        });
        output.push(tagData);
      }
      return output;
    }, [] as Promise<TagData>[])
  );

  // Remove media object ids from tags no longer used
  await Promise.all(
    existingTagIds.reduce((output, tagId) => {
      if (!newTagIdsOrNames.includes(tagId)) {
        output.push(removeMediaObjectFromTag(mediaObjectId, tagId));
      }
      return output;
    }, [] as Promise<TagData>[])
  );

  return tagIds;
};
