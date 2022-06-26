export const cacheFactory = <T>() => {
  let initialized = false;
  const cache: { [key: string]: T } = {};

  const getItem = (key: string) => {
    return cache[key];
  };

  const listItems = () => {
    return Object.keys(cache).map((key) => {
      return getItem(key);
    });
  };

  const upsertItem = (updateStateHook: () => void, key: string, value: T) => {
    cache[key] = value;
    updateStateHook();
  };

  const deleteItem = (updateStateHook: () => void, key: string) => {
    delete cache[key];
    updateStateHook();
  };

  const initializeCache = (
    updateStateHook: () => void,
    initialCacheData: { key: string; value: T }[],
    force?: boolean
  ) => {
    if (!initialized || force) {
      initialized = true;
      initialCacheData.map(({ key, value }) => {
        // Don't update the state after each upsert to reduce re-renders
        return upsertItem(() => {}, key, value);
      });
      updateStateHook();
    }
  };

  const clearCache = (updateStateHook: () => void) => {
    initialized = false;
    Object.keys(cache).map((key) => {
      // Don't update the state after each delete to reduce re-renders
      return deleteItem(() => [], key);
    });
    updateStateHook();
  };

  const isInitialized = () => {
    return initialized;
  };

  return {
    getItem,
    listItems,
    upsertItem,
    deleteItem,
    initializeCache,
    clearCache,
    isInitialized,
  };
};
