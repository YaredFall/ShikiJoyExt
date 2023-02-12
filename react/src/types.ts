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

export type ShikiJoyAnimeData = {
    coreData: ShikimoriAnimeCoreData,
    charData: Array<ShikimoriRole>
}

export type ShikimoriAnimePreviewData = {
    id: number,
    name: string,
    russian: string,
    image: ShikimoriImage,
    url: string,
    kind: ShikimoriKind,
    score: string,
    status: ShikimoriStatus,
    episodes: number,
    episodes_aired: number,
    aired_on: string | null,
    released_on: string | null
};

export type ShikimoriImage = {
    "original": string,
    "preview": string,
    "x96": string,
    "x48": string
}

export type ShikimoriAnimeCoreData = {
    id: number,
    name: string,
    russian: string,
    image: ShikimoriImage,
    url: string,
    kind: ShikimoriKind,
    score: string,
    status: ShikimoriStatus,
    episodes: number,
    episodes_aired: number,
    aired_on: string | null,
    released_on: string | null,
    rating: "pg_13" | "r" | "g" | "pg" | "r_plus" | "rx" | "none",
    english: Array<string> | [null],
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
    genres: ShikimoriGenre[],
    studios: ShikimoriStudio[],
    videos: Object[] | null, //TODO
    screenshots: Object[] | null, //TODO
    user_rate: ShikimoriUserRate | null
}

//shikimori types
export type ShikimoriStatus = "released" | "anons" | "ongoing"

export type ShikimoriKind = "tv" | "ova" | "ona" | "movie" | "special" | "music"

export type ShikimoriGenre = {
    id: number,
    name: string,
    russian: string,
    kind: string
}

export type ShikimoriStudio = {
    id: number,
    name: string,
    filtered_name: string,
    real: boolean,
    image: string | null
}

export type ShikimoriUserRateStatus = "watching" | "planned" | "on_hold" | "dropped" | "completed" | "rewatching"

export type ShikimoriUserRate = {
    id: number,
    score: number | null,
    status: ShikimoriUserRateStatus,
    text: string,
    episodes: number | null,
    chapters: number | null,
    volumes: number | null,
    text_html: string,
    rewatches: number | null,
    created_at: string,
    updated_at: string
}

export type ShikimoriCharacterOrPerson = {
    id: number,
    name: string,
    russian: string,
    image: ShikimoriImage
}

export type ShikimoriRole = {
    roles: string[],
    roles_russian: string[],
    character: ShikimoriCharacterOrPerson | null,
    url: string,
    person: ShikimoriCharacterOrPerson | null
}