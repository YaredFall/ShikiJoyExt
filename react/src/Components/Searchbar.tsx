import { FC, memo, RefObject, useRef, useState } from 'react';
import styles from "./Searchbar.module.scss";
import { IoSearchOutline } from "react-icons/all";
import { useAnimeJoySearch } from "../Api/useAnimeJoySearch";
import { useDebouncedValue } from "../Hooks/useDebouncedValue";
import { splitTitleOrStudioAndEpisodeCount } from "../Utils/scraping";
import { CSSTransition } from "react-transition-group";
import { SlArrowDown } from "react-icons/sl";

type ResultsProps = {
    data: Array<{ link: string | undefined, ru: string | undefined, romanji: string | undefined, posterSrc: string | undefined }> | undefined
    isLoading: boolean
    isError: boolean
    isNothingFound: boolean
    forwardRef?: RefObject<HTMLDivElement>
}
const Results: FC<ResultsProps> = memo(({ data, isLoading, isError, isNothingFound, forwardRef }) => {

    if (isError) {
        return (
            <div ref={forwardRef} className={styles.results}>
                <article className={`${styles.resultItem} ${styles.error}`}>Возникла ошибка!</article>
            </div>
        );
    }

    if (isNothingFound) {
        return <div ref={forwardRef} className={styles.results}>
            <article className={`${styles.resultItem} ${styles.error}`}>Ничего не найдено!</article>
        </div>;
    }

    if (!data) {
        return <div ref={forwardRef} className={styles.results}>
            <article className={`${styles.resultItem} ${styles.error}`}>Введите не меньше 3-х символов</article>
        </div>;
    }

    return (
        <div ref={forwardRef} className={styles.results}>
            {data!.map(e => {
                const [ruTitle, episodes] = splitTitleOrStudioAndEpisodeCount(e.ru);
                return (
                    <article key={ruTitle} className={styles.resultItem}>
                        <a href={e.link}><img className={styles.poster} src={e.posterSrc} alt={""} /></a>
                        <h4 className={styles.titles}>
                            <a href={e.link}><p className={styles.ruTitle}>{ruTitle}</p></a>
                            {episodes && <p className={"nowrap"}>{episodes}</p>}
                            <p className={styles.romanjiTitle}>{e.romanji}</p>
                        </h4>
                    </article>
                );
            })}

        </div>
    );
});

type SearchbarProps = {
    className?: string
}

const Searchbar: FC<SearchbarProps> = ({ className }) => {

    const [showResults, setShowResults] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
    const { data, isLoading, error, isError } = useAnimeJoySearch(debouncedSearchTerm);
    console.log({ mes: "search results", data, isError });

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    console.log(!!searchTerm);
    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <label className={styles.label} htmlFor={"quick-search"}>
                <input value={searchTerm}
                       ref={inputRef}
                       onChange={(e) => {
                           setSearchTerm(e.target.value);
                           if (!showResults) setShowResults(true);
                       }}
                       id={"quick-search"}
                       className={styles.searchInput}
                       type="text"
                       placeholder={"Быстрый поиск"}
                />
                <div className={styles.searchIcon}>
                    <IoSearchOutline />
                </div>
            </label>
            <button className={styles.resultsToggle} onClick={() => setShowResults(p => !p)} disabled={!searchTerm}>
                <SlArrowDown />
            </button>
            <CSSTransition nodeRef={resultsRef}
                           in={showResults && (isError || !!searchTerm)}
                           timeout={250}
                           unmountOnExit
                           mountOnEnter
                           classNames={{
                               enter: styles.enter,
                               enterDone: styles.enterDone,
                               exit: styles.exit,
                               exitDone: styles.exitDone
                           }}
            >
                <Results data={data}
                         isLoading={isLoading || searchTerm !== debouncedSearchTerm}
                         isError={isError}
                         isNothingFound={!isLoading && !isError && searchTerm.length >= 3 && !data}
                         forwardRef={resultsRef}
                />
            </CSSTransition>
        </div>
    );
};

export default memo(Searchbar);