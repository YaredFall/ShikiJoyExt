export const defautlQueryConfig = {
    retry: false,
    staleTime: 60 * 1000 * 60 * 12,
    cacheTime: 60 * 1000 * 60 * 12
}


export const ApiLinks = new Map([
    ["shikijoy", "https://shikijoy.fly.dev/"] as const,
    ["dev/shikijoy", "http://localhost:3000/"] as const,
    ["dev/animejoy", "http://localhost:3000/api/test/animejoy"] as const
])