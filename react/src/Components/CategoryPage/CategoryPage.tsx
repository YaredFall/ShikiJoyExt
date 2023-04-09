import { FC, useLayoutEffect, useRef, useState } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getNavigationPagesCount, getStoryList } from "../../Utils/scraping";
import CategoryStorycard from "./CategoryStorycard";
import styles from "./CategoryPage.module.scss";
import MainAndAsideWrapper from "../Layout/MainAndAsideWrapper";
import CategoryAside from "./CategoryAside";
import PagesNavigation from "./PagesNavigation";
import { useParams } from "react-router-dom";
import { Categories } from "../../Utils/appRoutes";
import LoadableText from "../Common/LoadableText";

type HomePageProps = {}

const CategoryPage: FC<HomePageProps> = () => {
    return (
        <MainAndAsideWrapper main={<MainElement />} aside={<CategoryAside />} />
    );
};

export default CategoryPage;

function MainElement() {

    const { id } = useParams();

    let category = window.location.pathname.split('/')[1];
    category = category === "page" ? "" : category;
    
    const lastCategory = useRef(category);

    const { data: page, isLoading } = useAnimeJoyAnimePageQuery(window.location.pathname === "/" ? "/page/1" : window.location.pathname);

    const [pagesCount, setPagesCount] = useState<number | undefined>(undefined);

    const stories = getStoryList(page);

    useLayoutEffect(() => {
        const nevCount = getNavigationPagesCount(page);

        if (!isLoading && pagesCount !== nevCount) {
            setPagesCount(nevCount);
        } else if (isLoading && category !== lastCategory.current) {
            setPagesCount(undefined);
        }
        lastCategory.current = category;

    }, [page, isLoading]);

    return (
        <>
            <div className={styles.pagesNav}>
                <h1>
                    <LoadableText placeholderLength={10}
                                  children={category ? [...Categories.entries()].find(c => c[1] === category)![0] 
                                                     : pagesCount ? "Главная" : undefined}
                    />
                </h1>
                <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={category ? "/" + category : undefined} />
            </div>
            <section className={styles.storylist}>
                {stories ? stories.map((s, i) => <CategoryStorycard key={i} data={s} />)
                         : [...Array(10)].map((s, i) => <CategoryStorycard key={i} data={undefined} />)
                }
            </section>
            <div className={styles.pagesNav}>
                <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} category={category ? "/" + category : undefined} />
            </div>
        </>
    );
}