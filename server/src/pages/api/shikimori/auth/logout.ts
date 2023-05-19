import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteCookie } from "cookies-next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    deleteCookie("shikimori_at", { req, res, path: "/" });
    deleteCookie("shikimori_rt", { req, res, path: "/" });
    res.status(200).send("Success");
}
