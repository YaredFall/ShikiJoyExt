import Dexie, { Table } from 'dexie';

export interface Anime {
    dbID?: number;
    animejoyID: string;
    lastStudio: number;
    lastPlayer: number;
    lastEpisode: number;
    watchedEpisodes: Set<number>
}

export class MySubClassedDexie extends Dexie {
    anime!: Table<Anime>;

    constructor() {
        super('shikijoyDB');
        this.version(2).stores({
            anime: '++dbID, &animejoyID' // Primary key and indexed props
        });
    }
}

export const db = new MySubClassedDexie();