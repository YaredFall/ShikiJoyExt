import { FC } from 'react';
import { StoryData } from "../types";
import Picture from "./Picture";
import styles from "./AnimeStorycard.module.scss";
import { Link } from "react-router-dom";
import LoadableText from "./LoadableText";

type AnimeStorycardProps = {
    data: StoryData | undefined
}


const AnimeStorycard: FC<AnimeStorycardProps> = ({ data }) => {

    return (
        <article className={styles.card}>
            <header>
                <h2><Link to={data?.url || ""}><LoadableText placeholderLength={30} children={data?.title.ru} /></Link></h2>
                <p><LoadableText placeholderLength={30} children={data?.title.romanji} /></p>
            </header>
            <div className={styles.posterAndInfo}>
                <Link to={data?.url || ""}><Picture className={styles.poster} src={data?.poster} /></Link>
                <div className={styles.info}>
                    {data ? data.info.map((e, k) => (
                              <p key={k}>
                                  <span className={styles.label}>{e.label}</span>
                                  {e.value.map((v, i) =>
                                      v.url ? <Link key={i} to={v.url} children={v.text} />
                                            : <span key={i} children={v.text} />)
                                  }
                              </p>))
                          : <InfoSkeleton />
                    }
                    {data ?
                     <div className={styles.description}>
                         <span className={styles.label}>Описание: </span>
                         <span>{data.description}</span>
                     </div>
                          : <div>
                         <LoadableText placeholderLength={60} />
                         <LoadableText placeholderLength={60} />
                         <LoadableText placeholderLength={40} />
                     </div>
                    }
                </div>
            </div>

            {data?.editDate && <div className={styles.editDate}>{data?.editDate}</div>}
        </article>
    );
};

export default AnimeStorycard;

function InfoSkeleton() {
    return (
        <div className={styles.info}>
            <LoadableText placeholderLength={40} />
            <LoadableText placeholderLength={20} />
            <LoadableText placeholderLength={36} />
            <LoadableText placeholderLength={16} />
            <LoadableText placeholderLength={44} />
            <LoadableText placeholderLength={30} />
            <LoadableText placeholderLength={25} />
            <LoadableText placeholderLength={28} />
            <LoadableText placeholderLength={18} />
        </div>
    );
}