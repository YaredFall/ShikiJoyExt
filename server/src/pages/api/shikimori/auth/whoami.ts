import type { NextApiRequest, NextApiResponse } from 'next';
import { getCookie, setCookie } from "cookies-next";
import { AuthResponse, fetchShikimoriAPI } from "@/shikimori_cfg";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let accessToken = getCookie('shikimori_at', { req, res });
    const refreshToken = getCookie('shikimori_rt', { req, res });

    if (!accessToken && !refreshToken) {
        res.status(401).send(null);
    } else {
        try {
            if (!accessToken) {
                const authResponse = await fetchShikimoriAPI<AuthResponse>("https://shikimori.me/oauth/token",
                    {
                        method: 'POST',
                        form: {
                            grant_type: "refresh_token",
                            client_id: process.env.SHIKIMORI_CLIENT_ID!,
                            client_secret: process.env.SHIKIMORI_CLIENT_SECRET!,
                            refresh_token: refreshToken as string
                        }
                    }
                );
                setCookie("shikimori_at", `${authResponse.token_type} ${authResponse.access_token}`,
                    { req, res, path: "/", maxAge: authResponse.expires_in, sameSite: "none", secure: true, httpOnly: true });
                setCookie("shikimori_rt", authResponse.refresh_token,
                    { req, res, path: "/", sameSite: "none", secure: true, httpOnly: true });
                
                accessToken = `${authResponse.token_type} ${authResponse.access_token}`;
            }

            const data = await fetchShikimoriAPI("/users/whoami",
                {
                    headers: {
                        Authorization: accessToken as string
                    }
                }
            );
            res.status(200).json(data);
        } catch (err: any) {
            console.log(err);
            if (err.response?.statusCode === 401) {
                res.status(401).send(null);
            } else {
                res.status(err.response?.statusCode || 500).send("Unhandled error!");
            }
        }
    }


}
