const singlePagePlayers = ["Alloha", "Kodik"]

export const isSinglePagePlayer = (name: string | undefined) => {
    return name && singlePagePlayers.includes(name);
}