import { NextApiResponse } from "next";
import cache from "memory-cache";
import { NextApiRequestWithCache } from "@/utils/caching";

export default function withCache(handler: (req: NextApiRequestWithCache, res: NextApiResponse) => any, key?: string) {
    return async (req: NextApiRequestWithCache, res: NextApiResponse) => {
        
        const cachedData = cache.get(key === undefined ? req.url : key);
        if (cachedData) {
            req.cachedData = cachedData;
        }
        
        return handler(req, res)
    }
}