export type PlayerData = { name: string, files: string[] }

export type StudioData = { name: string | undefined, players: PlayerData[]}

export type AnimeData = {
    id: string,
    studios: StudioData[]
}
