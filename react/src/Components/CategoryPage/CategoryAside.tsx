import { FC } from 'react';
import Searchbar from "../Common/Searchbar";
import SuggestionTabs from "../AnimePage/SuggestionTabs";
import styles from "../AnimePage/AnimeAside.module.scss"

type HomeAsideProps = {
    
}

const CategoryAside:FC<HomeAsideProps> = () => {
    return (
        <div className={styles.animeAside}>
            <Searchbar />
            <SuggestionTabs />
        </div>
    );
};

export default CategoryAside;