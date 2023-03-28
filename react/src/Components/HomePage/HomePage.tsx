import { FC } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import MainContainer from "../MainContainer";
import { getNavigationPagesCount, getStoryList } from "../../Utils/scraping";
import AnimeStorycard from "../AnimeStorycard";
import styles from "./HomePage.module.scss"
import MainAndAsideWrapper from "../MainAndAsideWrapper";
import HomeAside from "./HomeAside";
import DotSplitter from "../DotSplitter";
import PagesNavigation from "../PagesNavigation";
import { useParams } from "react-router-dom";

type HomePageProps = {}

const HomePage: FC<HomePageProps> = () => {
    return (
    );
};

export default HomePage;

function MainElement() {
    
    const { id } = useParams();

    const { data: page } = useAnimeJoyAnimePageQuery(`/page/${id || 1}`);

    const stories = getStoryList(page);

    return (
        <>
            <PagesNavigation pagesCount={getNavigationPagesCount(page)} currentPage={id ? +id : 1}/>
            <section className={styles.storylist}>
                {stories ? stories.map(s => <AnimeStorycard data={s} />) : [...Array(10)].map(s => <AnimeStorycard data={undefined} />)}
            </section>
            <PagesNavigation pagesCount={getNavigationPagesCount(page)} currentPage={id ? +id : 1}/>
        </>
    );
}