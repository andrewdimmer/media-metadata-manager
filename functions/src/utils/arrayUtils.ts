export const removeItemFromArray = <T>(array: T[], itemToRemove: T) => {
  return subtractArrays(array, [itemToRemove]);
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

export const unionArrayOfArrays = <T>(arrays: T[][]) => {
  return arrays.reduce((outputUnion, array) => {
    return unionArrays(outputUnion, array);
  }, [] as T[]);
};

export const subtractArrays = <T>(minuendArray: T[], subtrahendArray: T[]) => {
  return minuendArray.reduce((outputArray, checkItem) => {
    if (!subtrahendArray.includes(checkItem)) {
      outputArray.push(checkItem);
    }
    return outputArray;
  }, [] as T[]);
};

export const diffArrays = <T>(oldArray: T[], newArray: T[]) => {
  const unchangedItems = intersectionArrays(oldArray, newArray);
  const addedItems = subtractArrays(newArray, unchangedItems);
  const deletedItems = subtractArrays(oldArray, unchangedItems);

  return { addedItems, deletedItems };
};
