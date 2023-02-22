import { FC } from 'react';
import { useParams } from "react-router-dom";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";
import { getTitles } from "../../Utils/scraping";
import { ShikimoriRole } from "../../types";
import styles from "./Characters.module.scss";
import Picture from "../Picture";


const CharacterCard = ({ charData }: { charData: ShikimoriRole }) => {
    return (
        <article className={styles.charCard}>
            <a href={"https://shikimori.one" + charData.character?.url}>
                <Picture src={"https://shikimori.one" + charData.character!.image.preview} />
                <p>{charData.character?.russian}</p>
            </a>
        </article>
    );
};

type CharactersProps = {}

const Characters: FC<CharactersProps> = () => {

    const { id: fullID } = useParams();
    const { data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const {
        isLoading,
        isFetching,
        error,
        data
    } = useShikiJoyAnimeSearch(getTitles(pageDocument)?.romanji);

    return (
        <section>
            <h3 className={styles.header}>Персонажи</h3>
            <div className={styles.characters}>
                {data ?
                 data.charData.sort((a, b) => a.character!.russian > b.character!.russian ? 1 : -1)
                     .map(e => <CharacterCard key={e.character?.id} charData={e} />)
                      : !error ? "Загрузка..." : "Возникла ошибка!"
                }
            </div>
        </section>
    );
};

export default Characters;