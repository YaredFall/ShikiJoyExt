import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "./_config";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";
import userMockup from "../../dev/user_mockup.json"

export const useGetShikimoriUser = (enabled: boolean = true) => {
    const decrease = useGlobalLoadingStore(state => state.decrease )
    
    return useQuery(
        ["shikimori", "whoami"],
        async () => {
            if (import.meta.env.DEV) {
                decrease();
                return userMockup;
            } else {
                try {
                    const response = await ky.get(
                        (import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + "api/shikimori/auth/whoami",
                        { credentials: "include" });
                    decrease();
                    return response.json<any>()
                } catch (err: any) {
                    if (err.response.status === 401) {
                        decrease();
                        return null
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
        )
}