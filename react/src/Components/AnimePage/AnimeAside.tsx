import { FC } from 'react';
import AnimeDescription from "./AnimeDescription";
import Searchbar from "../Common/Searchbar";
import styles from "./AnimeAside.module.scss";
import SuggestionTabs from "../Common/SuggestionTabs";


type AnimeAsideProps = {}

const AnimeAside: FC<AnimeAsideProps> = () => {
    return (
        <div className={styles.animeAside}>
            <Searchbar className={styles.searchbar} />
            <AnimeDescription />
            <SuggestionTabs />
        </div>
    );
};

export default AnimeAside;