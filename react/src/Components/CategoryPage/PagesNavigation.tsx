import { FC, memo } from 'react';
import styles from "./PagesNavigation.module.scss";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { Link } from "react-router-dom";


const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);

type PagesNavigationProps = {
    pagesCount: number | undefined,
    currentPage: number
    category?: string
}


const PagesNavigation: FC<PagesNavigationProps> = ({ pagesCount, currentPage, category = "" }) => {
    
    let pagesNumbers = pagesCount ? [...Array(Math.min(10, pagesCount))].map((_, i) => ({
        value: currentPage + i + (pagesCount <= 9 || currentPage < 5 ? 1 - currentPage : -4)
            + (pagesCount <= 9 || (pagesCount - currentPage) > 4 ? 0 : -4 - currentPage + pagesCount),
        key: i
    })) : undefined;

    if (pagesCount && pagesCount > 9) {
        pagesNumbers = pagesNumbers ? pagesNumbers.slice(
            (currentPage > 5 || pagesCount! - currentPage < 4) ? 2 : 0,
            (currentPage > 5 && pagesCount! - currentPage < 4) ? -1 : -3
        ) : undefined;
    }

    return (
        <div className={styles.container}>
            {pagesCount && pagesCount > 1 && pagesNumbers &&
                <>
                    <Link className={currentPage - 1 > 0 ? undefined : styles.disabled}
                          to={currentPage - 1 > 0 ? `${category}/page/${currentPage - 1}/` : ""}
                          children={<MemoizedLeftIcon />}
                          tabIndex={currentPage - 1 > 0 ? undefined : -1}
                    />
                    {currentPage > 5 && pagesCount > 9 &&
                        <>
                            <Link to={`${category}/page/1/`} children={1} />
                            <span>...</span>
                        </>
                    }

                    {pagesNumbers.map((p, i) =>
                        <Link key={p.key}
                              className={p.value === currentPage ? styles.disabled : undefined}
                              to={`${category}/page/${p.value}/`}
                              children={p.value}
                              tabIndex={p.value === currentPage ? -1 : undefined}
                        />)
                    }

                    {pagesCount - currentPage >= 4 && pagesCount > 9 &&
                        <>
                            <span>...</span>
                            <Link to={`${category}/page/${pagesCount}/`} children={pagesCount} />
                        </>
                    }
                    <Link className={currentPage + 1 <= pagesCount ? undefined : styles.disabled}
                          to={currentPage + 1 <= pagesCount ? `${category}/page/${currentPage + 1}/` : ""}
                          children={<MemoizedRightIcon />}
                          tabIndex={currentPage + 1 <= pagesCount ? undefined : -1}
                    />
                </>
            }
        </div>
    );
};

export default PagesNavigation;