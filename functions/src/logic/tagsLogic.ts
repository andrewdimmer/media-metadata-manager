import { createTagFirestore, deleteTagFirestore } from "../firebase/tagsDAO";

const generateTagId = (tagName: string, tagType: TagType) => {
  const sanitizedName = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return `TAG_${tagType}_${sanitizedName}`;
};

export const convertTagDataToTag = (tagData: TagData): Tag => {
  return { ...tagData };
};

export const convertCreateTagInputToTagData = (
  input: CreateTagInput
): TagData => {
  const tagName = input.name.trim();
  const tagType = input.type || "CUSTOM";
  return {
    id: generateTagId(tagName, tagType),
    name: tagName,
    type: tagType,
  };
};

export const convertTagDataArrayToTagArray = (tagsData: TagData[]): Tag[] => {
  return tagsData.map((tagData) => {
    return convertTagDataToTag(tagData);
  });
};

export const createTagFromInput = async (input: CreateTagInput) => {
  const tagName = input.name.trim();
  const tagType = input.type || "CUSTOM";
  return createTagFirestore({
    id: generateTagId(tagName, tagType),
    name: tagName,
    type: tagType,
  });
};

export const deleteTagFromInput = async (input: DeleteTagInput) => {
  return deleteTagFirestore(input.id);
};
