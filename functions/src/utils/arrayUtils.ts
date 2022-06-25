export const removeItemFromList = <T>(list: T[], itemToRemove: T) => {
  return list.reduce((outputList, listItem) => {
    if (listItem !== itemToRemove) {
      outputList.push(listItem);
    }
    return outputList;
  }, [] as T[]);
};

export const unionLists = <T>(list1: T[], list2: T[]) => {
  const outputListInitial = list1.concat([]);
  return list2.reduce((outputList, list2item) => {
    if (!outputList.includes(list2item)) {
      outputList.push(list2item);
    }
    return outputList;
  }, outputListInitial);
};

export const intersectionLists = <T>(list1: T[], list2: T[]) => {
  // Short circuit empty lists
  if (list1.length === 0 || list2.length === 0) {
    return [];
  }

  return list1.reduce((outputList, list1item) => {
    if (list2.includes(list1item)) {
      outputList.push(list1item);
    }
    return outputList;
  }, [] as T[]);
};
