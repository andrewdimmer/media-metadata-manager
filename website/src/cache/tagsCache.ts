import { cacheFactory } from "./cacheFactory";

const cache = cacheFactory<Tag>();

export const getTagFromCache = cache.getItem;
export const listTagsInCache = cache.listItems;
export const upsertTagToCache = cache.upsertItem;
export const deleteTagFromCache = cache.getItem;
export const initializeTagsCache = cache.initializeCache;
export const clearTagsCache = cache.clearCache;
export const isTagsCacheInitialized = cache.isInitialized;
