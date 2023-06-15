import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie } from "cookies-next";
import { fetchShikimoriAPI } from "@/shikimori_cfg";
import cache from "memory-cache";
import { getCachedData } from "@/utils/caching";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { id } = req.query;
    if (!id || Array.isArray(id)) {
        return res.status(400).send("<h1>Bad request! Enter 'id' param!</h1>");
    }

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    } else if (req.method !== 'DELETE') {
        res.status(403).end();
    }

    const accessToken = getCookie('shikimori_at', { req, res }) as string | undefined | null;

    if (!accessToken) {
        return res.status(401).send("Not authorized!");
    }

    try {
        const response = await fetchShikimoriAPI<{ target_id: number }>(`/v2/user_rates/${id}`, {
            method: "GET",
            headers: {
                Authorization: accessToken as string
            }
        });
        await fetchShikimoriAPI<{ target_id: number }>(`/v2/user_rates/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: accessToken as string
            }
        });
        const cacheKey = '/api/shikimori/anime/' + response.target_id + accessToken;
        const cachedData = getCachedData(cacheKey);
        cache.put(cacheKey, cachedData ? { ...cachedData, user_rate: null } : null);
        res.status(204).send(response);
    } catch (err) {
        console.error(err);
        return res.status(500).send("Unhandled error");
    }
}
