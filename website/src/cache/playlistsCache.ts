import { cacheFactory } from "./cacheFactory";

const cache = cacheFactory<Playlist>();

export const getPlaylistFromCache = cache.getItem;
export const listPlaylistsInCache = cache.listItems;
export const upsertPlaylistToCache = cache.upsertItem;
export const deletePlaylistFromCache = cache.getItem;
export const initializePlaylistsCache = cache.initializeCache;
export const clearPlaylistsCache = cache.clearCache;
export const isPlaylistCacheInitialized = cache.isInitialized;
