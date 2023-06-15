import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from "cookies-next";
import { fetchShikimoriAPI } from "@/shikimori_cfg";
import cache from "memory-cache";
import { getCachedData } from "../../../../utils/caching";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    } else if (req.method !== 'POST') {
        res.status(403).end()
    }
    
    const accessToken = getCookie('shikimori_at', { req, res }) as string | undefined | null;
    
    if (!accessToken) {
        return res.status(401).send("Not authorized!");
    }
    
    try {
        const response = await fetchShikimoriAPI<{target_id: number}>("/v2/user_rates", {
            method: "POST",
            headers: {
                Authorization: accessToken as string
            },
            json: {
                "user_rate": {
                    ...req.body,
                    target_type: "Anime"
                }
            }
        })
        const cacheKey = '/api/shikimori/anime/' + response.target_id + accessToken;
        const cachedData = getCachedData(cacheKey);
        cache.put(cacheKey, cachedData ? { ...cachedData, user_rate: response } : null);
        res.status(200).send(response)
    } catch (err) {
        console.error(err);
        return res.status(500).send("Unhandled error")
    }
}
