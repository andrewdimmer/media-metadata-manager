import { logger } from "firebase-functions";
import {
  convertMediaObjectDataToMediaObject,
  createMediaObjectFromInput,
  deleteMediaObjectFromInput,
  updateMediaObjectFromInput,
} from "../../logic/mediaObjectsLogic";

const createMediaObject = async ({
  input,
}: GraphqlMutationInput<CreateMediaObjectInput>): Promise<MediaObject> => {
  logger.info(
    `Running Mutation: createMediaObject(input: ${JSON.stringify(input)})`
  );
  const mediaObjectData = await createMediaObjectFromInput(input);
  return convertMediaObjectDataToMediaObject(mediaObjectData);
};

const updateMediaObject = async ({
  input,
}: GraphqlMutationInput<UpdateMediaObjectInput>): Promise<MediaObject> => {
  logger.info(
    `Running Mutation: updateMediaObject(input: ${JSON.stringify(input)})`
  );
  const mediaObjectData = await updateMediaObjectFromInput(input);
  return convertMediaObjectDataToMediaObject(mediaObjectData);
};

const deleteMediaObject = async ({
  input,
}: GraphqlMutationInput<DeleteMediaObjectInput>): Promise<MediaObject> => {
  logger.info(
    `Running Mutation: deleteMediaObject(input: ${JSON.stringify(input)})`
  );
  const mediaObjectData = await deleteMediaObjectFromInput(input);
  return convertMediaObjectDataToMediaObject(mediaObjectData);
};

export const mutations = {
  createMediaObject,
  updateMediaObject,
  deleteMediaObject,
};
