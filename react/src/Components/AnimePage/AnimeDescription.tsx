import { FC } from 'react';
import { ShikimoriAnimeCoreData } from "../../types";
import styles from "./AnimeDescription.module.scss"

type AnimeDescriptionProps = {
    data: ShikimoriAnimeCoreData
}

const AnimeDescription:FC<AnimeDescriptionProps> = ( { data } ) => {
    return (
        <div className={styles.posterAndDetails}>
            <img src={"https://shikimori.one" + data.image.original} />
            <div className={styles.details}>
                <div><span>Тип:</span><span>{data.kind}</span></div>
                <div><span>Эпизодов:</span><span>{data.episodes}</span></div>
                <div><span>Длительность эпизода:</span><span>{data.duration}</span></div>
                <div><span>Статус:</span><span>{data.status}</span></div>
                <div><span>Жанры:</span><span>{data.genres.map(g => g.russian).join(" ")}</span></div>
                <div><span>Возрастной рейтинг:</span><span>{data.rating}</span></div>
                <div><span>Рейтинг:</span><span>{data.score}</span></div>
            </div>
        </div>
    );
};

export default AnimeDescription;