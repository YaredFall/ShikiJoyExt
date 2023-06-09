import { cacheData, getCachedData, NextApiRequestWithCache } from '@/utils/caching';
import type { NextApiResponse } from 'next'
import { fetchShikimoriAPI } from '@/shikimori_cfg'
import withCache from '@/middleware/withCache';
import { getCookie } from "cookies-next";

const animeDataCacheKeyBase = '/api/shikimori/anime/'; //prepend to keys
const charactersKey = '/characters'; //append to keys

async function handler(
    req: NextApiRequestWithCache,
    res: NextApiResponse
) {
    const { name, id } = req.query;
    if ((!name && !id )|| Array.isArray(name) || Array.isArray(id)) {
        return res.status(400).send("<h1>Bad request! Enter 'name' or 'id' param!</h1>")
    }

    const accessToken = getCookie('shikimori_at', { req, res }) as string | undefined | null;

    try {
        let shikiID = id;
        if (!shikiID) {
            shikiID = req.cachedData;
            if (!shikiID) {
                const searchRes = await fetchShikimoriAPI('/animes?search=' + name) as [{ id: number, aired_on: string | null, released_on: string | null }] | []
                if (searchRes.length === 0) {
                    return res.status(404).end();
                }
                shikiID = "" + searchRes[0].id;
                cacheData(req.url, shikiID);
            }
        }

        const getCoreData = async () => {
            let coreData = getCachedData(animeDataCacheKeyBase + shikiID + accessToken);
            if (!coreData) {
                coreData = await fetchShikimoriAPI('/animes/' + shikiID, {
                    headers: {
                        Authorization: accessToken || undefined
                    }
                });
                cacheData(animeDataCacheKeyBase + shikiID + accessToken, coreData);
            }
            return coreData;
        }

        const getCharData = async () => {
            let charData = getCachedData(animeDataCacheKeyBase + shikiID + charactersKey);
            if (!charData) {
                const roles = await fetchShikimoriAPI('/animes/' + shikiID + '/roles') as Array<{ roles: string[] }>;
                charData = roles.filter(r => r.roles.includes("Main") || r.roles.includes("Supporting"));

                cacheData(animeDataCacheKeyBase + shikiID + charactersKey, charData);
            }
            return charData;
        }

        const [coreData, charData] = await Promise.all([getCoreData(), getCharData()])

        return res.status(200).json({ coreData, charData });
    }
    catch (err) {
        return res.status(400).send(`<h1>${err}</h1>`)
    }
}

export default withCache(handler);