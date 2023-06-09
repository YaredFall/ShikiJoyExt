import { ShikimoriUserRate } from "../types";
import ky from "ky";
import { ApiLinks } from "./_config";

export async function createRate(rate: {user_id: number, target_id: number, status?: ShikimoriUserRate["status"], score?: number}) {
    try {
        await ky.post((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + 'api/shikimori/user_rates/create', {
            credentials: "include",
            json: {
                user_id: rate.user_id?.toString(),
                target_id: rate.target_id?.toString(),
                status: rate.status,
                score: rate.score?.toString(),
            }
        })
    } catch (err) {
        throw err;
    }
}

export async function updateRate(rateID: number, rate: {user_id: number, target_id: number, status?: ShikimoriUserRate["status"], score?: number}) {
    try {
        await ky.patch((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + 'api/shikimori/user_rates/update', {
            credentials: "include",
            json: {
                user_id: rate.user_id?.toString(),
                target_id: rate.target_id?.toString(),
                status: rate.status,
                score: rate.score?.toString(),
            }
        })
    } catch (err) {
        throw err;
    }
}

export async function deleteRate(rateID: number) {
    try {
        await ky.delete((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + 'api/shikimori/user_rates/delete', {
            credentials: "include",
        })
    } catch (err) {
        throw err;
    }
}