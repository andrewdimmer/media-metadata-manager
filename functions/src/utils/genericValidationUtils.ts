import { requiredStringIsEmptyError } from "./errorHandlingUtils";

export const validateStringOrArrayIsNotEmpty = (
  string: string | any[],
  fieldName: string
) => {
  if (string.length === 0) {
    requiredStringIsEmptyError(fieldName);
  }
};
