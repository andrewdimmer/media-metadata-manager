import { v4 as uuid } from "uuid";
import {
  createMediaObjectFirestore,
  deleteMediaObjectFirestore,
  readMediaObjectFirestore,
  updateMediaObjectFirestore,
} from "../firebase/mediaObjectsDAO";

const generateMediaObjectId = () => {
  return `MEDIA_${uuid()}`;
};

export const convertMediaObjectDataToMediaObject = (
  mediaObjectData: MediaObjectData
): MediaObject => {
  return { ...mediaObjectData };
};

export const convertCreateMediaObjectInputToMediaObjectData = (
  input: CreateMediaObjectInput
): MediaObjectData => {
  return {
    id: generateMediaObjectId(),
    ...input,
  };
};

export const convertMediaObjectDataArrayToMediaObjectArray = (
  mediaObjectsData: MediaObjectData[]
): MediaObject[] => {
  return mediaObjectsData.map((mediaObjectData) => {
    return convertMediaObjectDataToMediaObject(mediaObjectData);
  });
};

export const createMediaObjectFromInput = async (
  input: CreateMediaObjectInput
) => {
  const mediaObjectId = generateMediaObjectId();
  return createMediaObjectFirestore({
    id: mediaObjectId,
    name: input.name,
    externalResources: input.externalResources,
    sources: input.sources,
  });
};

export const updateMediaObjectFromInput = async (
  input: UpdateMediaObjectInput
) => {
  const existingMediaObject = await readMediaObjectFirestore(input.id);
  return updateMediaObjectFirestore({
    id: input.id,
    name: input.name || existingMediaObject.name,
    externalResources:
      input.externalResources || existingMediaObject.externalResources,
    sources: input.sources || existingMediaObject.sources,
  });
};

export const deleteMediaObjectFromInput = async (
  input: DeleteMediaObjectInput
) => {
  return deleteMediaObjectFirestore(input.id);
};
