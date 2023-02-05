import { FC } from 'react';
import { ShikimoriAnimeCoreData } from "../../types";
import styles from "./AnimeDescription.module.scss";
import Picture from "../Picture";


type AnimeDescriptionProps = {
    data: ShikimoriAnimeCoreData | undefined
}

const AnimeDescription:FC<AnimeDescriptionProps> = ( { data } ) => {

    return (
        <section className={styles.description}>
            <h3 className={styles.header}>Об аниме</h3>
            <div className={styles.posterAndDetails}>
                <Picture className={styles.img} src={data ? "https://shikimori.one" + data.image.original : undefined} />
                <div className={styles.details}>
                    <div><span>Тип:</span><span>{data?.kind}</span></div>
                    <div><span>Эпизодов:</span><span>{data?.episodes}</span></div>
                    <div><span>Длительность эпизода:</span><span>{data?.duration}</span></div>
                    <div><span>Статус:</span><span>{data?.status}</span></div>
                    <div><span>Жанры:</span><span>{data?.genres.map(g => g.russian).join(" ")}</span></div>
                    <div><span>Возрастной рейтинг:</span><span>{data?.rating}</span></div>
                    <div><span>Рейтинг:</span><span>{data?.score}</span></div>
                </div>
            </div>
        </section>
    );
};

export default AnimeDescription;