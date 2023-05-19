export type FileData = {
    label: string
    file: string
}

export type PlayerData = {
    name: string | undefined
    files: FileData[]
}

export type StudioData = {
    name: string | undefined
    players: PlayerData[]
}

export type Titles = {
    ru: string
    romanji: string
}

export type StoryData = {
    title: Titles,
    url: string,
    poster: string,
    status?: "FULL" | "ONGOING",
    description?: string,
    info: Array<{ label?: string, value: Array<{ text: string, url?: string }> }>,
    editDate?: string,
    category: string[],
    comments?: number
}

export type FranchiseData = Array<{ label: string, url: string | null }>

export type AnimeJoyData = {
    id: string
    titles: Titles
    franchise?: FranchiseData
    studios: StudioData[]
}

export type ShikiJoyAnimeData = {
    coreData: ShikimoriAnimeCoreData,
    charData: Array<ShikimoriAnimeRole>
}

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

export type ShikimoriAnimePreviewData = Pick<ShikimoriAnimeCoreData,
    "aired_on" | "episodes" | "episodes_aired" | "id" | "image" | "kind" | "name" | "released_on" | "russian" | "score" | "status" | "url">

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
    url: string,
    image: ShikimoriImage
}

export type ShikimoriCharacter = {
    id: number,
    name: string,
    russian: string,
    url: string,
    image: ShikimoriImage,
    animes: Array<{
        "id": number,
        "name": string,
        "russian": string,
        "image": ShikimoriImage,
        "url": string,
        "kind": ShikimoriKind,
        "score": string,
        "status": ShikimoriStatus,
        "episodes": number | null,
        "episodes_aired": number | null,
        "aired_on": string | null,
        "released_on": string | null,
        "roles": Array<ShikimoriAnimeRoleType>,
        "role": ShikimoriAnimeRoleType
    }>
}

export type ShikimoriCharacterPreview = Pick<ShikimoriCharacter, "id" | "name" | "russian" | "image" | "url">

export type ShikimoriPerson = {
    "id": number,
    "name": string,
    "russian": string,
    "image": ShikimoriImage,
    "url": string,
    "japanese": string,
    "job_title": "Сэйю" | string, // ! Incomplete
    "birth_on": {
        "day": number,
        "month": number
    },
    "deceased_on": {}, // ? idk
    "website": string,
    "groupped_roles": Array<[
        string,
        number
    ]>,
    "roles": Array<{ characters: ShikimoriCharacterPreview[], animes: ShikimoriAnimePreviewData[] }>,
    "works": any[], // ?
    "topic_id": number,
    "person_favoured": boolean,
    "producer": boolean,
    "producer_favoured": boolean,
    "mangaka": boolean,
    "mangaka_favoured": boolean,
    "seyu": boolean,
    "seyu_favoured": boolean,
    "updated_at": string,
    "thread_id": number,
    "birthday": {
        "day": number,
        "month": number
    }
}

export type ShikimoriAnimeRoleType = "Main" | "Supporting" // ! incomplete

export type ShikimoriAnimeRole = {
    roles: Array<ShikimoriAnimeRoleType>,
    roles_russian: Array<ShikimoriAnimeRoleType>,
    character: ShikimoriCharacterOrPerson | null,
    person: ShikimoriCharacterOrPerson | null
}

export type ShikimoriUser = {
    "id": number, 
    "nickname": string, 
    "avatar": string,
    "image": { 
        "x160": string, 
        "x148": string, 
        "x80": string, 
        "x64": string, 
        "x48": string, 
        "x32": string, 
        "x16": string 
    }, 
    "last_online_at": string, 
    "url": string, 
    "name": string | null, 
    "sex": "male" | "female" | null, 
    "website": string, 
    "birth_on": string | null, 
    "full_years": number | null, 
    "locale": "ru" | string // ! incomplete
}