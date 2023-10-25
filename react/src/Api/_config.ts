export const defautlQueryConfig = {
    retry: 1,
    staleTime: 60 * 1000 * 60 * 12,
    cacheTime: 60 * 1000 * 60 * 12
}


export const ApiLinks = new Map([
    ["shikimori", "https://shikimori.one"] as const,
    ["shikijoy", "https://shikijoy.fly.dev/"] as const,
    ["dev/shikijoy", "http://localhost:3000/"] as const,
    ["dev/animejoy", "http://localhost:3000/api/test/animejoy"] as const
])