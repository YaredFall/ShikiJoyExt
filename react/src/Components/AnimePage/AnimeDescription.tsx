import { FC } from 'react';
import { ShikimoriAnimeCoreData } from "../../types";
import styles from "./AnimeDescription.module.scss";
import Picture from "../Common/Picture";
import shikimoriLogo from '/images/shikimori_logo.png';
import plural from 'plural-ru';
import DotSplitter from "../Common/DotSplitter";
import LoadableText from "../Common/LoadableText";
import { ApiLinks } from "../../Api/_config";

//@ts-ignore
const shikimoriLogoExt = chrome.runtime?.getURL("bundled/images/shikimori_logo.png");

//"tv" | "ova" | "ona" | "movie" | "special" | "music"
const shikimoriKindMap = new Map([
    ["tv", "TV"],
    ["ova", "OVA"],
    ["ona", "ONA"],
    ["movie", "Фильм"],
    ["special", "Спешл"],
    ["music", "Клип"],
]);

//"released" | "anons" | "ongoing"
const shikimoriStatusMap = new Map([
    ["released", "вышло"],
    ["anons", "анонс"],
    ["ongoing", "выходит"],
]);

//"pg_13" | "r" | "g" | "pg" | "r_plus" | "rx" | "none"
const shikimoriAgeRatingMap = new Map([
    ["g", { short: "G", explained: "Без возрастных ограничений" }],
    ["pg", { short: "PG", explained: "Рекомендуется присутствие родителей" }],
    ["pg_13", { short: "PG-13", explained: "Детям до 13 лет просмотр не желателен" }],
    ["r", { short: "R-17", explained: "Лицам до 17 лет обязательно присутствие взрослого" }],
    ["r_plus", { short: "R+", explained: "Лицам до 17 лет просмотр запрещён" }],
    ["rx", { short: "Rx", explained: "Хентай" }],
    ["none", { short: "N/A", explained: "Неизвестно" }],
]);

type AnimeDescriptionProps = {
    data: ShikimoriAnimeCoreData | undefined
}

const AnimeDescription: FC<AnimeDescriptionProps> = ({ data }) => {

    return (
        <section className={styles.description}>
            <header className={styles.header}>
                <h4>Информация</h4>
                <a className={styles.shikimoriLink} href={data ? ApiLinks.get("shikimori") + data.url : undefined} target={"_blank"}>
                    <img className={styles.shikimoriLogo} src={shikimoriLogoExt || shikimoriLogo} alt={"Shikimori"} />
                </a>
            </header>
            <div className={styles.posterAndDetails}>
                <div className={styles.poster}>
                    <Picture className={styles.picture} src={data ? ApiLinks.get("shikimori") + data.image.original : undefined} />
                    {data && <div className={styles.score} children={"★ " + data.score } />}
                </div>
                {data ?
                 <div className={styles.details}>
                     <div className={styles.kindStatusAndRating}>
                         <div className={styles.kind} children={shikimoriKindMap.get(data.kind)} />
                         <DotSplitter />
                         <div className={styles.status} children={shikimoriStatusMap.get(data.status)} />
                         <DotSplitter />
                         <div className={styles.ageRating}
                              title={shikimoriAgeRatingMap.get(data.rating)!.explained}
                              children={shikimoriAgeRatingMap.get(data.rating)!.short}
                         />
                     </div>
                     {data.aired_on ? <div children={(data.status === "ongoing" || data.released_on ? "С " : "") + `${new Intl.DateTimeFormat('ru-RU', {
                         year: "numeric",
                         month: "long",
                         day: "numeric"
                     }).format(new Date(data.aired_on))}`}
                     /> : ""}
                     {data.released_on ? <div children={`по ${new Intl.DateTimeFormat('ru-RU', {
                         year: "numeric",
                         month: "long",
                         day: "numeric"
                     }).format(new Date(data.released_on))}`}
                     /> : ""}
                     <div className={styles.episodesAndDuration}>
                         {`${plural(data.episodes || data.episodes_aired, '', '%d эпизода по', '%d эпизодов по')} ${
                             plural(data.duration, '%d минуте', '%d минуты', '%d мин.')}`}
                     </div>
                     <div className={styles.genres}>{data?.genres.map(
                         (g, i) => (<div className={styles.genre} children={`${g.russian}`} key={i} />))}</div>

                 </div>
                      : <DescriptionSkeleton />
                }
            </div>
        </section>
    );
};

export default AnimeDescription;

const DescriptionSkeleton: FC = () => {
    return (
        <div className={styles.details}>
            <LoadableText placeholderLength={20} />
            <LoadableText placeholderLength={12} />
            <LoadableText placeholderLength={16} />
            <LoadableText placeholderLength={14} />
            <LoadableText placeholderLength={17} />
            <LoadableText placeholderLength={10} />
            <LoadableText placeholderLength={15} />
        </div>
    )
}