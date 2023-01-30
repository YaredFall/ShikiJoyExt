export type PlayerData = {
    name: string
    files: string[]
}

export type StudioData = {
    name: string | undefined
    players: PlayerData[]
}

export type Titles = {
    ru: string
    romanji: string
}

export type AnimeJoyData = {
    id: string
    titles: Titles
    studios: StudioData[]
}

export type ShikimoriAnimeCoreData = {
    id: number,
    name: string,
    russian: string,
    image: {
        "original": string,
        "preview": string,
        "x96": string,
        "x48": string
    },
    url: string,
    kind: "tv" | "ova" | "ona" | "movie" | "special" | "music",
    score: string,
    status: "released" | "anons" | "ongoing",
    episodes: number,
    episodes_aired: number,
    aired_on: string | null,
    released_on: string | null,
    rating: "pg_13" | "r" | string, //TODO
    english: Array<string>,
    japanese: Array<string>,
    synonyms: Array<string>,
    license_name_ru: string | null,
    duration: number,
    description: string | null,
    description_html: string,
    description_source: string | null,
    franchise: string | null,
    favoured: boolean,
    anons: boolean,
    ongoing: boolean,
    thread_id: number,
    topic_id: number,
    myanimelist_id: number,
    rates_scores_stats: Array<{ name: number, value: number }>,
    rates_statuses_stats: Array<{ name: string, value: number }>,
    updated_at: string,
    next_episode_at: string | null,
    fansubbers: string[],
    fandubbers: string[],
    licensors: any[], //TODO
    genres: Genre[],
    studios: Object[], //TODO
    videos: Object[], //TODO
    screenshots: Object[], //TODO
    user_rate: Object | null //TODO
}

//shikimori types
export type Genre =
    {
        id: number,
        name: string,
        russian: string,
        kind: string
    }
