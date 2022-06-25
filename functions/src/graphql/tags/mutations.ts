import { logger } from "firebase-functions";
import {
  convertTagDataToTag,
  createTagFromInput,
  deleteTagFromInput,
} from "../../logic/tagsLogic";

const createTag = async ({
  input,
}: GraphqlMutationInput<CreateTagInput>): Promise<Tag> => {
  logger.info(`Running Mutation: createTag(input: ${JSON.stringify(input)})`);
  const tagData = await createTagFromInput(input);
  return convertTagDataToTag(tagData);
};

const deleteTag = async ({
  input,
}: GraphqlMutationInput<DeleteTagInput>): Promise<Tag> => {
  logger.info(`Running Mutation: deleteTag(input: ${JSON.stringify(input)})`);
  const tagData = await deleteTagFromInput(input);
  return convertTagDataToTag(tagData);
};

export const mutations = {
  createTag,
  deleteTag,
};
