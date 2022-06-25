export const removeItemFromList = <T>(list: T[], itemToRemove: T) => {
  return list.reduce((outputList, listItem) => {
    if (listItem !== itemToRemove) {
      outputList.push(listItem);
    }
    return outputList;
  }, [] as T[]);
};
