import { FC, Fragment, memo, useRef, useState } from 'react';
import styles from "./Searchbar.module.scss";
import { IoSearchOutline } from "react-icons/io5";
import { useAnimeJoySearch } from "../../Api/useAnimeJoySearch";
import { useDebouncedValue } from "../../Hooks/useDebouncedValue";
import { splitTitleOrStudioAndEpisodeCount } from "../../Utils/scraping";
import { SlArrowDown } from "react-icons/sl";
import { Menu, Transition } from '@headlessui/react';
import { Link } from "react-router-dom";
import { StoryData } from "../../types";

type ResultsProps = {
    data: StoryData[] | undefined
    isLoading: boolean
    isError: boolean
    isNothingFound: boolean
    onLinkClick?: () => void
}
const Results: FC<ResultsProps> = memo(({ data, isLoading, isError, isNothingFound, onLinkClick }) => {

    if (isError) {
        return <article className={`${styles.resultItem} ${styles.message}`}>Возникла ошибка!</article>;
    }
    if (isNothingFound) {
        return <article className={`${styles.resultItem} ${styles.message}`}>Ничего не найдено!</article>;
    }
    if (isLoading) {
        return <article className={`${styles.resultItem} ${styles.message}`}>Загрузка...</article>;
    }
    if (!data) {
        return <article className={`${styles.resultItem} ${styles.message}`}>Введите не менее 3-х символов</article>;
    }

    return (
        <>
            {data.map(e => {
                const [ruTitle, episodes] = splitTitleOrStudioAndEpisodeCount(e.title.ru);
                return (
                    <Menu.Item as={"article"} key={ruTitle} className={styles.resultItem}>
                        <Link to={e.url || ""} onClick={onLinkClick}><img className={styles.poster} src={e.poster} alt={""} /></Link>
                        <h4 className={styles.titles}>
                            <Link to={e.url || ""} onClick={onLinkClick}><p className={styles.ruTitle}>{ruTitle}</p></Link>
                            {episodes && <p className={"nowrap"}>{episodes}</p>}
                            <p className={styles.romanjiTitle}>{e.title.romanji}</p>
                        </h4>
                    </Menu.Item>
                );
            })}

        </>
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

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    return (
        <Menu as={"div"} className={`${styles.container} ${className ? className : ""}`}>
            <label className={styles.label} htmlFor={"quick-search"}>
                <input value={searchTerm}
                       ref={inputRef}
                       onChange={(e) => {
                           setSearchTerm(e.target.value);
                           if (!showResults) setShowResults(true);
                       }}
                       autoComplete={"off"}
                       id={"quick-search"}
                       className={styles.searchInput}
                       type="text"
                       role={"search"}
                       placeholder={"Быстрый поиск"}
                />
                <div className={styles.searchIcon}>
                    <IoSearchOutline />
                </div>
            </label>
            <Menu.Button className={styles.resultsToggle} onClick={() => setShowResults(p => !p)} disabled={!searchTerm}>
                <SlArrowDown />
            </Menu.Button>
            <Transition as={Fragment}
                        show={showResults && (isError || !!searchTerm)}
                        enterFrom={styles.enterFrom}
                        enterTo={styles.enterTo}
                        leaveFrom={styles.exitFrom}
                        leaveTo={styles.exitTo}
            >
                <Menu.Items static as={"div"} ref={resultsRef} className={styles.results}>
                    <Results data={data}
                             isLoading={(searchTerm.length >= 3) && (isLoading || (searchTerm !== debouncedSearchTerm))}
                             isError={isError && !isLoading && (searchTerm === debouncedSearchTerm)}
                             isNothingFound={!isLoading && !isError && (searchTerm.length >= 3) && (searchTerm === debouncedSearchTerm) && !data}
                             onLinkClick={() => setShowResults(false)}
                    />
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default memo(Searchbar);