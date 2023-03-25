import type { NextApiRequest, NextApiResponse } from 'next';
import { AuthResponse, fetchShikimoriAPI } from '@/shikimori_cfg';
import { setCookie } from "cookies-next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { code } = req.query;
    if ((!code) || Array.isArray(code)) {
        return res.status(400).send("<h1>Bad request! Enter 'code' param!</h1>");
    }
    const formData = {
        grant_type: "authorization_code",
        client_id: process.env.SHIKIMORI_CLIENT_ID!,
        client_secret: process.env.SHIKIMORI_CLIENT_SECRET!,
        code: code,
        redirect_uri: "https://animejoy.ru/shikijoy/auth-callback"
    };
    
    try {
        const data = await fetchShikimoriAPI<AuthResponse>("https://shikimori.one/oauth/token", { method: "POST", form: formData });
        setCookie("shikimori_at", `${data.token_type} ${data.access_token}`,
            { req, res, path: "/", maxAge: data.expires_in, sameSite: "none", secure: true, httpOnly: true });
        setCookie("shikimori_rt", data.refresh_token,
            { req, res, path: "/", sameSite: "none", secure: true, httpOnly: true });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).send("<h1>Bad request!</h1>")
    }
}
