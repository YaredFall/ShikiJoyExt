export enum appRoutes {
    authCallback = "shikijoy/auth-callback",
    test = "tv-serialy/2914-dlya-tebya-bessmertnyy-2-sezon.html",
    test2 = "tv-serialy/3009-angel-po-sosedstvu.html",
    home = "/",
    page = "page/:id",
    serials = "tv-serialy",
    films = "anime-films",
    ova = "ova",
    dorams = "dorams",
    ongoing = "ongoing",
    full_tv = "full_tv",
    anons = "anons",
    idParam = ":id",
    nonexistent = "nonexistent",
    any = "*"
}

export const Categories = new Map([
    ["Главная", ""],
    ["TV Сериалы", appRoutes.serials],
    ["Аниме фильмы", appRoutes.films],
    ["Дорамы", appRoutes.dorams],
    ["Онгоинги", appRoutes.ongoing],
    ["Завершенные", appRoutes.full_tv],
    ["OVA/ONA/OAV", appRoutes.ova],
    ["Анонсы", appRoutes.anons]
]);