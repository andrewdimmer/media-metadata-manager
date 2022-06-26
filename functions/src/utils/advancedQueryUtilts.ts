import { tagsQueries } from "../graphql/tags";
import {
  intersectionArrays,
  unionArrayOfArrays,
  unionArrays,
} from "./arrayUtils";
import { logAndThrowError } from "./errorHandlingUtils";
import { validateStringOrArrayIsNotEmpty } from "./genericValidationUtils";

export const cleanFilterString = (filter: string) => {
  const cleanFilter = filter.replace(/\s/g, "");
  validateStringOrArrayIsNotEmpty(cleanFilter, "The filter string");
  return cleanFilter;
};

export const validateFilterStringAndExtractTagIds = async (
  filter: string
): Promise<string[]> => {
  // Single Tag Filter
  if (filter.indexOf("TAG_") === 0) {
    if (filter.replace(/[A-Za-z0-9-_]/g, "").length > 0) {
      logAndThrowError(`The tag id=${filter} contains unexpected characters.`);
    }

    // Check tag exists and add to cache for future operations
    await tagsQueries.tag({ id: filter });
    return [filter];
  }

  // AND or OR Filter
  if (filter.indexOf("AND(") === 0 || filter.indexOf("OR(") === 0) {
    if (filter.charAt(filter.length - 1) !== ")") {
      logAndThrowError("Filter has unbalanced parentheses.");
    }

    // Remove the "AND" or "OR" from the filter
    const filterStart = filter.indexOf("AND(") === 0 ? "AND(" : "OR(";
    const filterSubstring = filter.substring(
      filterStart.length,
      filter.length - 1
    );
    const tagIdsRaw = await Promise.all(
      filterSubstring.split(",").map((filterToken) => {
        return validateFilterStringAndExtractTagIds(filterToken);
      })
    );
    return unionArrayOfArrays(tagIdsRaw);
  }

  logAndThrowError(
    "Invalid Filter: Start of filter is not a tag id, AND, or OR."
  );
  return []; // Should never happen, just needed for the type system
};

export const getMediaObjectIdsMatchingFilter = async (
  filter: string
): Promise<string[]> => {
  if (filter.indexOf("TAG_") === 0) {
    // Single Tag Filter
    return (await tagsQueries.tag({ id: filter })).mediaObjectIds;
  } else {
    // Compound Tag Filter
    // Remove the "AND" or "OR" from the filter
    const filterStart = filter.indexOf("AND(") === 0 ? "AND(" : "OR(";
    const filterSubstring = filter.substring(
      filterStart.length,
      filter.length - 1
    );
    const mediaObjectIds = await Promise.all(
      filterSubstring.split(",").map((filterToken) => {
        return getMediaObjectIdsMatchingFilter(filterToken);
      })
    );

    return mediaObjectIds.reduce(
      (mediaOnjectMatchingFilter, newMediaObjectIds) => {
        return filterStart === "AND("
          ? intersectionArrays(mediaOnjectMatchingFilter, newMediaObjectIds)
          : unionArrays(mediaOnjectMatchingFilter, newMediaObjectIds);
      },
      filterStart === "AND("
        ? unionArrayOfArrays(mediaObjectIds)
        : ([] as string[])
    );
  }
};

export const checkIfMediaObejctMatchesFilter = (
  filter: string,
  mediaObjectTagIds: string[]
): boolean => {
  if (filter.indexOf("TAG_") === 0) {
    // Single Tag Filter
    return mediaObjectTagIds.includes(filter);
  } else {
    // Compound Tag Filter
    // Remove the "AND" or "OR" from the filter
    const filterStart = filter.indexOf("AND(") === 0 ? "AND(" : "OR(";
    const filterSubstring = filter.substring(
      filterStart.length,
      filter.length - 1
    );
    const mediaObjectIds = filterSubstring.split(",").map((filterToken) => {
      return checkIfMediaObejctMatchesFilter(filterToken, mediaObjectTagIds);
    });

    return mediaObjectIds.reduce(
      (matchFilter, matchNewFilterToken) => {
        return filterStart === "AND("
          ? matchFilter && matchNewFilterToken
          : matchFilter || matchNewFilterToken;
      },
      filterStart === "AND(" ? true : false
    );
  }
};
