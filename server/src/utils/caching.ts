import cache from 'memory-cache';
import { NextApiRequest } from "next";

export type NextApiRequestWithCache = NextApiRequest & { cachedData: any }

export function cacheData(key: any, data: any, seconds: number = 60*60*24) {
    cache.put(key, data, 1000 * seconds);
}

export function getCachedData(key:any) {
    return cache.get(key);
}
