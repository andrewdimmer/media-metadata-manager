import { logger } from "firebase-functions";
import {
  listMediaObjectsFirestore,
  readMediaObjectFirestore,
} from "../../firebase/mediaObjectsDAO";
import {
  convertMediaObjectDataArrayToMediaObjectArray,
  convertMediaObjectDataToMediaObject,
} from "../../logic/mediaObjectsLogic";

const mediaObjects = async (): Promise<MediaObject[]> => {
  logger.info("Running Query: mediaObjects");
  const mediaObjectsData = await listMediaObjectsFirestore();
  return convertMediaObjectDataArrayToMediaObjectArray(mediaObjectsData);
};

const mediaObject = async ({ id }: GraphqlQueryId): Promise<MediaObject> => {
  logger.info(`Running Query: mediaObject(id=${id})`);
  const mediaObjectData = await readMediaObjectFirestore(id);
  return convertMediaObjectDataToMediaObject(mediaObjectData);
};

export const queries = {
  mediaObjects,
  mediaObject,
};
