const singlePagePlayers = ["Alloha", "Kodik"]

export const isSinglePagePlayer = (name: string) => {
    return singlePagePlayers.includes(name);
}