import { FC, useMemo, useRef, useState } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";
import { getShikimoriID } from "../../Utils/scraping";
import { ShikimoriRole } from "../../types";
import styles from "./Characters.module.scss";
import Picture from "../Common/Picture";
import LoadableText from "../Common/LoadableText";
import CharacterPopupCard from "./CharacterPopupCard";
import { ApiLinks } from "../../Api/_config";


const CharacterCard = ({ charData }: { charData: ShikimoriRole }) => {

    const boxRef = useRef<HTMLAnchorElement>(null);

    return (
        <article className={styles.charCard}>
            <a ref={boxRef} href={ApiLinks.get("shikimori")! + charData.character?.url}>
                <Picture src={ApiLinks.get("shikimori") + charData.character!.image.preview} />
                <p>{charData.character?.russian || charData.character?.name}</p>
            </a>
            <CharacterPopupCard id={charData.character?.id} bindNode={boxRef} />
        </article>
    );
};

const CharacterCardSkeleton = () => {
    return (
        <article className={styles.charCard}>
            <Picture className={styles.imgSkeleton} />
            <LoadableText placeholderLength={12} />
        </article>
    );
};

type CharactersProps = {}

const Characters: FC<CharactersProps> = () => {

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(window.location.pathname);

    const { data } = useShikiJoyAnimeSearch(getShikimoriID(pageDocument));

    const sortedChars = useMemo(() => {
        if (data) {
            const collator = new Intl.Collator();
            return data.charData.sort((a, b) =>
                collator.compare(a.character!.russian || a.character!.name, b.character!.russian || b.character!.name));
        } else {
            return undefined;
        }
    }, [data]);

    return (
        <section>
            <h3 className={styles.header}>Персонажи</h3>
            <div className={styles.characters}>
                {sortedChars ?
                 sortedChars.map(e => <CharacterCard key={e.character?.id} charData={e} />)
                             : [...Array(10)].map((_, i) => <CharacterCardSkeleton key={i} />)
                }
            </div>
        </section>
    );
};

export default Characters;