import { FC } from 'react';
import { getNewsOrRelatedAndPopular } from "../../Utils/scraping";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { Tab } from '@headlessui/react';
import { Link } from "react-router-dom";
import LoadableText from "../Common/LoadableText";
import Picture from "../Common/Picture";
import styles from "./SuggestionTabs.module.scss"
import { Categories } from "../../Utils/appRoutes";

type SuggestionTabsProps = {}

const SuggestionTabs: FC<SuggestionTabsProps> = () => {

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(location.pathname);

    const relatedAndPopularShows = getNewsOrRelatedAndPopular(pageDocument);
    
    const shouldShowNews = location.pathname === "/" || [...Categories.values()].some(c => location.pathname === `/${c}/`) || location.pathname.match(/\/page\/\d{1,3}\/$/)
    
    return (
        <Tab.Group defaultIndex={shouldShowNews ? 1 : 0}>
            <Tab.List className={styles.tabList}>
                <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.selected : ""}`}>{shouldShowNews ? "Новости" : "Похожее"}</Tab>
                <Tab className={({ selected }) => `${styles.tab} ${selected ? styles.selected : ""}`}>Популярное</Tab>
            </Tab.List>
            <Tab.Panels>
                <SuggestionTab data={shouldShowNews ? relatedAndPopularShows?.news : relatedAndPopularShows?.related} />
                <SuggestionTab data={relatedAndPopularShows?.popular} />
            </Tab.Panels>
        </Tab.Group>
    );
};

export default SuggestionTabs;

function SuggestionTab({ data }: { data?: Exclude<ReturnType<typeof getNewsOrRelatedAndPopular>, undefined>[keyof Exclude<ReturnType<typeof getNewsOrRelatedAndPopular>, undefined>] }) {
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