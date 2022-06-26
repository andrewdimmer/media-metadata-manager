import { cacheFactory } from "./cacheFactory";

const cache = cacheFactory<MediaObject>();

export const getMediaObjectFromCache = cache.getItem;
export const listMediaObjectsInCache = cache.listItems;
export const upsertMediaObjectToCache = cache.upsertItem;
export const deleteMediaObjectFromCache = cache.getItem;
export const initializeMediaObjectsCache = cache.initializeCache;
export const clearMediaObjectsCache = cache.clearCache;
export const isMediaObjectsCacheInitialized = cache.isInitialized;
