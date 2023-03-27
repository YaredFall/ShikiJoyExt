import { FC } from 'react';
import { StoryData } from "../types";
import Picture from "./Picture";
import styles from "./AnimeStorycard.module.scss";

type AnimeStorycardProps = {
    data: StoryData | undefined
}

const AnimeStorycard: FC<AnimeStorycardProps> = ({ data }) => {
    return (
        <article className={styles.card}>
            <header>
                <h2>{data?.title.ru}</h2>
                <p>{data?.title.romanji}</p>
            </header>
            <div className={styles.posterAndInfo}>
                <Picture className={styles.poster} src={data?.poster} />
                <div className={styles.info}>
                    {data?.info.map(e => (
                        <p key={e.label}>
                            <span className={styles.label}>{e.label}</span>
                            {e.value.map((v, i) =>
                                v.url ? <a key={i} href={v.url} children={v.text} /> 
                                      : <span key={i} children={v.text} />)
                            }
                        </p>))}
                </div>
            </div>
            <div className={styles.description}>
                {data?.description}
            </div>
            {data?.editDate && <div className={styles.editDate}>{data?.editDate}</div>}
        </article>
    );
};

export default AnimeStorycard;