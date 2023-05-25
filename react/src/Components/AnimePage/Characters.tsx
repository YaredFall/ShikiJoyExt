import React, { FC, ForwardedRef, Fragment, useMemo, useRef } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";
import { getShikimoriID } from "../../Utils/scraping";
import { ShikimoriAnimeRole, ShikimoriAnimeRoleType } from "../../types";
import styles from "./Characters.module.scss";
import Picture from "../Common/Picture";
import LoadableText from "../Common/LoadableText";
import CharacterPopupCard from "./CharacterPopupCard";
import { ApiLinks } from "../../Api/_config";
import { Disclosure } from '@headlessui/react';


const CharacterCard = ({ charData }: { charData: ShikimoriAnimeRole }) => {

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


const CharactersList = React.forwardRef(
    (props: { charsData: ShikimoriAnimeRole[] | undefined, role?: ShikimoriAnimeRoleType }, ref: ForwardedRef<HTMLDivElement>) => {
        const { charsData, role } = { ...props };

        return (
            <div className={styles.characters}>
                {charsData ?
                    (role ? charsData.filter(c => c.roles[0] === role) : charsData).map(
                        e => <CharacterCard key={e.character?.id} charData={e} />)
                    : [...Array(4)].map((_, i) => <CharacterCardSkeleton key={i} />)
                }
                {charsData && role && <div className={styles.label} children={role === "Main" ? "Основные" : "Второстепенные"} />}
            </div>
        );
    });

type CharactersProps = {}

const Characters: FC<CharactersProps> = () => {

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(window.location.pathname);

    const { data, error } = useShikiJoyAnimeSearch(getShikimoriID(pageDocument));

    const sortedChars = useMemo(() => {
        if (data) {
            const collator = new Intl.Collator();
            return data.charData.sort((a, b) =>
                collator.compare(a.character!.russian || a.character!.name, b.character!.russian || b.character!.name));
        } else {
            return undefined;
        }
    }, [data]);

    if (error) return null;

    return (
        <Disclosure as={"section"} className={styles.container}>
            {({ open }) => (
                <>
                    <div className={styles.headerRow}>
                        <h3 className={styles.header}>Персонажи</h3>
                        <Disclosure.Button className={styles.toggle}>
                            {open ? "Скрыть второстепенных" : "Показать всех"}
                        </Disclosure.Button>
                    </div>
                    <CharactersList charsData={sortedChars} role={"Main"} />
                    <Disclosure.Panel as={Fragment}>
                        <CharactersList charsData={sortedChars} role={"Supporting"} />
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Characters;