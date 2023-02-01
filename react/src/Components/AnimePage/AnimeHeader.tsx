import { FC } from 'react';
import styles from "./AnimeHeader.module.scss";
import { Titles } from "../../types";
import { nestedChildrenCompareMemo } from "../../Utils/childrenCompareMemo";
import LoadableText from "../LoadableText";

type AnimeHeaderProps = {
    titles: Titles | undefined
    placeholderLength?: number
}

const AnimeHeader: FC<AnimeHeaderProps> = ({
    titles,
    placeholderLength = 40
}) => {

    return (
        <header className={styles.headerContainer}>
            <div className={styles.titlesSection}>
                <h1 className={styles.titleRU}
                    children={<LoadableText placeholderLength={placeholderLength} children={titles?.ru} />} />
                <h2 className={styles.titleRomanji}
                    children={<LoadableText placeholderLength={placeholderLength} children={titles?.romanji} />}
                />
            </div>
        </header>
    );
};

export default nestedChildrenCompareMemo(AnimeHeader);