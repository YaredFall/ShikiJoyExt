import { FC } from 'react';
import { getRelatedAndPopularShows } from "../../Utils/scraping";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { Tab } from '@headlessui/react';
import { Link } from "react-router-dom";
import LoadableText from "../Common/LoadableText";
import Picture from "../Common/Picture";
import styles from "./SuggestionTabs.module.scss"

type SuggestionTabsProps = {}

const SuggestionTabs: FC<SuggestionTabsProps> = () => {

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(location.pathname);

    const relatedAndPopularShows = getRelatedAndPopularShows(pageDocument);
    
    return (
        <Tab.Group>
            <Tab.List className={styles.tabList}>
                <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.selected : ""}`}>Похожее</Tab>
                <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.selected : ""}`}>Популярное</Tab>
            </Tab.List>
            <Tab.Panels>
                <SuggestionTab data={relatedAndPopularShows?.related} />
                <SuggestionTab data={relatedAndPopularShows?.popular} />
            </Tab.Panels>
        </Tab.Group>
    );
};

export default SuggestionTabs;

function SuggestionTab({ data }: { data?: Exclude<ReturnType<typeof getRelatedAndPopularShows>, undefined>[keyof Exclude<ReturnType<typeof getRelatedAndPopularShows>, undefined>] }) {
    return (
        <Tab.Panel className={styles.panel}>
            <ul>
                {((data && data.length > 0) ? data : [...Array(5)]).map((e, i) =>
                    <li key={i}>
                        <Link to={e?.url}>
                            <Picture className={styles.poster} src={e?.poster} />
                            <div className={styles.titles}>
                                {e?.titles.map((t: string) => <LoadableText key={t} placeholderLength={20} children={t} />)}
                            </div>
                        </Link>
                    </li>
                )}
            </ul>
        </Tab.Panel>

    );
}