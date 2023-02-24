import { FC, useMemo } from 'react';
import { useParams } from "react-router-dom";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";
import { getShikimoriID, getTitles } from "../../Utils/scraping";
import { ShikimoriRole } from "../../types";
import styles from "./Characters.module.scss";
import Picture from "../Picture";
import LoadableText from "../LoadableText";


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

const CharacterCardSkeleton = () => {
    return (
    <article className={styles.charCard}>
            <Picture className={styles.imgSkeleton}/>
        <LoadableText placeholderLength={12} />
    </article>
    )
}

type CharactersProps = {}

const Characters: FC<CharactersProps> = () => {

    const { id: fullID } = useParams();
    const { data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const {
        isLoading,
        isFetching,
        error,
        data
    } = useShikiJoyAnimeSearch(getShikimoriID(pageDocument));

    const sortedChars = useMemo(() => {
        if (data)
            return data.charData.sort((a, b) => a.character!.russian > b.character!.russian ? 1 : -1)
        else return undefined
    }, [data])

    console.log(data)
    return (
        <section>
            <h3 className={styles.header}>Персонажи</h3>
            <div className={styles.characters}>
                {sortedChars ?
                 sortedChars.map(e => <CharacterCard key={e.character?.id} charData={e} />)
                      : [...Array(10)].map((_,i) => <CharacterCardSkeleton key={i} />)
                }
            </div>
        </section>
    );
};

export default Characters;