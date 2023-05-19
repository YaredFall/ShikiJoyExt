import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "./_config";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";
import userMockup from "../../dev/user_mockup.json";
import { ShikimoriUser } from "../types";

export const useGetShikimoriUser = (enabled: boolean = true) => {
    const decrease = useGlobalLoadingStore(state => state.decrease);

    return useQuery(
        ["shikimori", "whoami"],
        async () => {
            if (import.meta.env.DEV) {
                await new Promise(res => setTimeout(res, 750));
                decrease();

                // return null;
                return userMockup as ShikimoriUser;
            } else {
                try {
                    const response = await ky.get(
                        (import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + "api/shikimori/auth/whoami",
                        { credentials: "include" });
                    decrease();
                    return response.json<ShikimoriUser | null>();
                } catch (err: any) {
                    if (err.response.status === 401) {
                        decrease();
                        return null;
                    } else {
                        decrease();
                        throw err;
                    }
                }
            }
        },
        {
            ...defautlQueryConfig,
            enabled
        }
    );
};