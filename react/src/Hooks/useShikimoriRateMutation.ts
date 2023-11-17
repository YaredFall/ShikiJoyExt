import { ShikimoriUserRate } from "../types";
import ky from "ky";
import { useMutation } from "react-query";
import { ApiLinks } from "../Api/_config";

export type NewRate = {
    user_id: number,
    target_id: number,
    status?: ShikimoriUserRate["status"],
    score?: number;
};

async function createRate(rate: NewRate) {
    await ky.post((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + 'api/shikimori/user_rates/create', {
        credentials: "include",
        json: rate
    });
}

async function updateRate(rateID: number, rate: NewRate) {
    await ky.patch((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/user_rates/update/${rateID}`, {
        credentials: "include",
        json: rate
    });
}

async function deleteRate(rateID: number) {
    await ky.delete((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/user_rates/delete/${rateID}`, {
        credentials: "include",
    });
}

type RateMutation = {
    type: "create";
    rateData: NewRate;
} | {
    type: "update";
    rateID: number;
    rateData: NewRate;
} | {
    type: "delete";
    rateID: number;
};
export function useRateMutation() {
    return useMutation((mutation: RateMutation) => {
        switch (mutation.type) {
            case "create": return createRate(mutation.rateData);
            case "update": return updateRate(mutation.rateID, mutation.rateData);
            case "delete": return deleteRate(mutation.rateID);
        }
    });
};