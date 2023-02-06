import { FC, useRef } from 'react';
import styles from "./AnimeHeader.module.scss";
import { Titles } from "../../types";
import { nestedChildrenCompareMemo } from "../../Utils/childrenCompareMemo";
import LoadableText from "../LoadableText";
import { splitTitleOrStudioAndEpisodeCount } from "../../Utils/scraping";
import DotSplitter from "../DotSplitter";

type AnimeHeaderProps = {
    titles: Titles | undefined
    placeholderLength?: number
}

const AnimeHeader: FC<AnimeHeaderProps> = ({
    titles,
    placeholderLength = 40
}) => {

    const [ruTitle, episodesAvailable] = splitTitleOrStudioAndEpisodeCount(titles?.ru);

    return (
        <header className={styles.headerContainer}>
            <div className={styles.titlesSection}>
                <h1 className={styles.titleRU}>
                    <LoadableText placeholderLength={placeholderLength} children={ruTitle} />
                    {episodesAvailable &&
                        <><DotSplitter /><span className={"nowrap"}>{episodesAvailable}</span></>
                    }
                </h1>
                <p className={styles.titleRomanji}
                    children={<LoadableText placeholderLength={placeholderLength} children={titles?.romanji} />}
                />
            </div>
        </header>
    );
};

export default nestedChildrenCompareMemo(AnimeHeader);