export const removeItemFromArray = <T>(array: T[], itemToRemove: T) => {
  return array.reduce((outputArray, arrayItem) => {
    if (arrayItem !== itemToRemove) {
      outputArray.push(arrayItem);
    }
    return outputArray;
  }, [] as T[]);
};

export const unionArrays = <T>(array1: T[], array2: T[]) => {
  const outputArrayInitial = array1.concat([]);
  return array2.reduce((outputArray, array2item) => {
    if (!outputArray.includes(array2item)) {
      outputArray.push(array2item);
    }
    return outputArray;
  }, outputArrayInitial);
};

export const intersectionArrays = <T>(array1: T[], array2: T[]) => {
  // Short circuit empty arrays
  if (array1.length === 0 || array2.length === 0) {
    return [];
  }

  return array1.reduce((outputArray, array1item) => {
    if (array2.includes(array1item)) {
      outputArray.push(array1item);
    }
    return outputArray;
  }, [] as T[]);
};
