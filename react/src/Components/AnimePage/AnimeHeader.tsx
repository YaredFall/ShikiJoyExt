import { FC } from 'react';
import styles from "./AnimeHeader.module.scss";
import { Titles } from "../../types";
import { nestedChildrenCompareMemo } from "../../Utils/childrenCompareMemo";

type AnimeHeaderProps = {
    titles: Titles
}

const AnimeHeader:FC<AnimeHeaderProps> = ({ titles }) => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.titlesSection}>
                <h1 className={styles.titleRU} children={titles.ru}/>
                <h2 className={styles.titleRomanji} children={titles.romanji}/>
            </div>
        </header>
    );
};

export default  nestedChildrenCompareMemo(AnimeHeader);