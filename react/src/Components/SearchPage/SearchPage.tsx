import { FC, useRef } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { useAnimeJoySearch } from '../../Api/useAnimeJoySearch';
import { Categories } from "../../Utils/appRoutes";
import CategoryAside from "../CategoryPage/CategoryAside";
import CategoryStorycard from "../CategoryPage/CategoryStorycard";
import PagesNavigation from "../CategoryPage/PagesNavigation";
import LoadableText from "../Common/LoadableText";
import MainAndAsideWrapper from "../Layout/MainAndAsideWrapper";
import styles from "../CategoryPage/CategoryPage.module.scss";
import searchStyles from "../Common/Searchbar.module.scss"
import { IoSearchOutline } from "react-icons/io5";

type SearchPageProps = {};

const SearchPage: FC<SearchPageProps> = () => {
    return (
        <MainAndAsideWrapper main={<MainElement />} aside={<CategoryAside />} />
    );
};

export default SearchPage;

function MainElement() {

    const [searchParams, setSearchParams] = useSearchParams();
    const term = searchParams.get("term") ?? undefined;

    // let category = window.location.pathname.split('/')[1];
    // category = category === "page" ? "" : category;

    // const lastCategory = useRef(category);

    const { data: stories, isLoading } = useAnimeJoySearch(term);

    // useLayoutEffect(() => {
    //     const nevCount = getNavigationPagesCount(page);

    //     if (!isLoading && pagesCount !== nevCount) {
    //         setPagesCount(nevCount);
    //     } else if (isLoading && category !== lastCategory.current) {
    //         setPagesCount(undefined);
    //     }
    //     lastCategory.current = category;

    // }, [page, isLoading]);
    const pagesCount = 1;
    const id = 1;

    return (
        <div className={styles.categoryPage}>
            <label className={searchStyles.label} htmlFor={"quick-search"}>
                <input value={term}
                    onChange={(e) => {
                        searchParams.set("term", e.target.value);
                        setSearchParams(searchParams);
                    }}
                    autoComplete={"off"}
                    className={searchStyles.searchInput}
                    type="text"
                    role={"search"}
                    placeholder={"Поиск"}
                />
                <div className={searchStyles.searchIcon}>
                    <IoSearchOutline />
                </div>
            </label>
            <div className={styles.pagesNav}>
                <h1>
                    <LoadableText placeholderLength={10}
                        children={!isLoading ? "Поиск" : undefined}
                    />
                </h1>
                <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={"/"} />
            </div>
            <section className={styles.storylist}>
                {stories ? stories.map((s, i) => <CategoryStorycard key={i} data={s} />)
                    : isLoading ? [...Array(3)].map((s, i) => <CategoryStorycard key={i} data={undefined} />) : "Ничего не найдено"
                }
            </section>
            <div className={styles.pagesNav}>
                <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={"/"} />
            </div>
        </div>
    );
}