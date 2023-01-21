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

export type AnimeData = {
    id: string
    title: Titles
    studios: StudioData[]
}
