import { requiredStringIsEmptyError } from "./errorHandlingUtils";

export const validateStringIsNotEmpty = (string: string, fieldName: string) => {
  if (!string) {
    requiredStringIsEmptyError(fieldName);
  }
};
