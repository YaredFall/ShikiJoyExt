import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from "cookies-next";
import { fetchShikimoriAPI } from "@/shikimori_cfg";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookie = getCookie('shikimori_auth', {req, res});
    
    if (!cookie) {
        res.status(401).send(null)
    } else {
        const data = await fetchShikimoriAPI("https://shikimori.one/api/users/whoami",
            {
                headers: {
                    Authorization: cookie as string
                }
            }
        )
        res.status(200).json(data);
    }
    

}
