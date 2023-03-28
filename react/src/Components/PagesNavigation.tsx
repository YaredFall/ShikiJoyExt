import { FC, memo } from 'react';
import styles from "./PagesNavigation.module.scss";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { Link } from "react-router-dom";

type PagesNavigationProps = {
    pagesCount: number | undefined,
    currentPage: number
}

const MemoizedLeftIcon = memo(SlArrowLeft);
const MemoizedRightIcon = memo(SlArrowRight);

const PagesNavigation: FC<PagesNavigationProps> = ({ pagesCount, currentPage }) => {

    let pagesNumbers = pagesCount
                         ? [...Array(Math.min(10, pagesCount))].map((_, i) => 
            (currentPage + i + (currentPage < 5 ? 1-currentPage : -4) + (pagesCount - currentPage > 4 ? 0 : -4-currentPage+pagesCount)))
                         : undefined;
    pagesNumbers = pagesNumbers 
                   ? pagesNumbers.slice((currentPage > 5 || pagesCount! - currentPage < 4) ? 2 : 0, (currentPage > 5 && pagesCount! - currentPage < 4)? -1 : -3)
                   : undefined

    return (
        <div className={styles.container}>
            {pagesCount && pagesNumbers &&
                <>
                    <Link className={currentPage - 1 > 0 ? undefined : styles.disabled}
                          to={currentPage - 1 > 0 ? `/page/${currentPage - 1}` : ""}
                          children={<MemoizedLeftIcon />}
                    />
                    {currentPage > 5 && 
                        <>
                            <Link to={`/page/1`} children={1} />
                            <span>...</span>
                        </>
                    }
                    
                    {pagesNumbers.map(p =>
                        <Link className={p === currentPage ? styles.disabled : undefined} to={`/page/${p}`} children={p} />)
                    }
                    
                    {pagesCount - currentPage >= 4 &&
                        <>
                            <span>...</span>
                            <Link to={`/page/${pagesCount}`} children={pagesCount} />
                        </>
                    }
                    <Link className={currentPage + 1 <= pagesCount ? undefined : styles.disabled}
                          to={currentPage + 1 <= pagesCount ? `/page/${currentPage + 1}` : ""}
                          children={<MemoizedRightIcon />}
                    />
                </>
            }
        </div>
    );
};

export default PagesNavigation;