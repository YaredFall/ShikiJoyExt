import { FC, useLayoutEffect, useState } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getNavigationPagesCount, getStoryList } from "../../Utils/scraping";
import AnimeStorycard from "../AnimeStorycard";
import styles from "./HomePage.module.scss";
import MainAndAsideWrapper from "../MainAndAsideWrapper";
import HomeAside from "./HomeAside";
import PagesNavigation from "../PagesNavigation";
import { useParams } from "react-router-dom";

type HomePageProps = {}

const HomePage: FC<HomePageProps> = () => {
    return (
        <MainAndAsideWrapper main={<MainElement />} aside={<HomeAside />} />
    );
};

export default HomePage;

function MainElement() {

    const { id } = useParams();

    const { data: page } = useAnimeJoyAnimePageQuery(`/page/${id || 1}`);

    const [pagesCount, setPagesCount] = useState<number | undefined>(undefined);

    const stories = getStoryList(page);

    useLayoutEffect(() => {
        if (pagesCount === undefined) {
            setPagesCount(getNavigationPagesCount(page));
        }
    }, [page]);


    return (
        <>
            <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} />
            <section className={styles.storylist}>
                {stories ? stories.map((s, i) => <AnimeStorycard key={i} data={s} />)
                         : [...Array(10)].map((s, i) => <AnimeStorycard key={i} data={undefined} />)
                }
            </section>
            <PagesNavigation pagesCount={pagesCount} currentPage={id ? +id : 1} />
        </>
    );
}