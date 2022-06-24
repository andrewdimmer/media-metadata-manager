import { logger } from "firebase-functions";
import { listTagsFirestore, readTagFirestore } from "../../firebase/tagsDAO";
import {
  convertTagDataArrayToTagArray,
  convertTagDataToTag,
} from "../../logic/tagsLogic";

const tags = async (): Promise<Tag[]> => {
  logger.info("Running Query: tags");
  const tagsData = await listTagsFirestore();
  return convertTagDataArrayToTagArray(tagsData);
};

const tag = async ({ id }: GraphqlQueryId): Promise<Tag> => {
  logger.info(`Running Query: tag(id=${id})`);
  const tagData = await readTagFirestore(id);
  return convertTagDataToTag(tagData);
};

export const queries = {
  tags,
  tag,
};
