import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks } from "./_config";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";

export const useGetShikimoriTokens = (code: string | null) => {
    const decrease = useGlobalLoadingStore(state => state.decrease )

    return useQuery(
        ["shikimori/tokens"],
        async () => {
            try {
                const response = await ky.post(
                    ApiLinks.get("shikijoy") + `api/shikimori/auth/callback?code=${code}`,
                    { credentials: "include" }
                )
                return response.json();
            } catch (err) {
                decrease();
                throw err;
            }
        }
    )
};