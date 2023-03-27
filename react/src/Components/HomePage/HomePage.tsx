import { FC } from 'react';
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import MainContainer from "../MainContainer";
import { getStoryList } from "../../Utils/scraping";
import AnimeStorycard from "../AnimeStorycard";
import styles from "./HomePage.module.scss"
import MainAndAsideWrapper from "../MainAndAsideWrapper";

type HomePageProps = {}

const HomePage: FC<HomePageProps> = () => {
    return (
        <MainAndAsideWrapper main={<MainElement />} aside={<div />} />
    );
};

export default HomePage;

function MainElement() {

    const { data: page } = useAnimeJoyAnimePageQuery("/page/1");

    const stories = getStoryList(page);

    return (
        <>
            <h1 className={styles.header}>ShikiJoy - Главная</h1>
            <section className={styles.storylist}>
                {stories && stories.map(s => <AnimeStorycard data={s} />)}
            </section>
        </>
    );
}