import { CSSProperties, FC, Fragment, useLayoutEffect, useRef, useState } from 'react';
import { StoryData } from "../../types";
import Picture from "../Common/Picture";
import styles from "./CategoryStorycard.module.scss";
import { Link } from "react-router-dom";
import LoadableText from "../Common/LoadableText";
import DotSplitter from "../Common/DotSplitter";
import { Categories } from "../../Utils/appRoutes";
import { IoMdArrowDropright, MdOutlineModeComment } from "react-icons/all";

const LINES_TOTAL = 17;

type AnimeStorycardProps = {
    data: StoryData | undefined
}


const CategoryStorycard: FC<AnimeStorycardProps> = ({ data }) => {

    const [linesAvailable, setLinesAvailable] = useState(0);
    const infoRef = useRef<HTMLDivElement>(null);
    const calcAvailableLines = () => {
        if (infoRef?.current?.clientHeight) {
            const linesUsed = ~~(infoRef.current.clientHeight / 20.18);
            setLinesAvailable(LINES_TOTAL - linesUsed);
        }
    };

    useLayoutEffect(() => {
        window.addEventListener("resize", calcAvailableLines);
        return () => {
            window.removeEventListener("resize", calcAvailableLines);
        };
    }, []);

    useLayoutEffect(() => {
        calcAvailableLines();
    }, [data]);


    return (
        <article className={styles.card}>
            <header>
                <h2><Link to={data?.url || ""} className={data ? undefined : styles.disabled}><LoadableText placeholderLength={30}
                                                                                                            children={data?.title.ru}
                /></Link></h2>
                <p><LoadableText placeholderLength={30} children={data?.title.romanji} /></p>
            </header>
            <div className={styles.posterAndInfo}>
                <Link to={data?.url || ""}><Picture className={styles.poster} src={data?.poster} /></Link>
                <div className={styles.infoAndDesc}>
                    <div className={styles.info} ref={infoRef}>
                        {data ? data.info.map((e, k) => (
                                  <p key={k}>
                                      <span className={styles.label}>{e.label}</span>
                                      {e.value.map((v, i) =>
                                          v.url ? <Link key={i} to={v.url} children={v.text} />
                                                : <span key={i} children={v.text} />)
                                      }
                                  </p>))
                              : <InfoSkeleton />
                        }
                    </div>
                    {data ?
                     <div className={styles.description} style={{ "--max-lines": linesAvailable } as CSSProperties}>
                         <span className={styles.label}>Описание: </span>
                         <span>{data.description}</span>
                     </div>
                          : null
                    }
                </div>
            </div>
            {data?.editDate && <div className={styles.editDate}>{data?.editDate}</div>}
            <div className={styles.categoryAndComments}>
                <div className={styles.category}>
                    {data ?
                     <>
                         <IoMdArrowDropright />
                         {data.category.map((c, i) => (i === 0
                                                       ? <Link to={"/" + Categories.get(c)} key={i} children={c} />
                                                       : <Fragment key={i}><DotSplitter /><Link to={"/" + Categories.get(c) + "/"} children={c} /></Fragment>
                         ))}
                     </> : <LoadableText placeholderLength={16} />}
                </div>
                <div className={styles.comments} title={"Комментарии"}>
                    {data?.comments !== undefined ?
                     <><MdOutlineModeComment /><span children={data.comments} /></>
                                    : <LoadableText placeholderLength={4} />
                    }
                </div>
            </div>
        </article>
    );
};

export default CategoryStorycard;

function InfoSkeleton() {
    return (
        <div className={styles.info}>
            <LoadableText placeholderLength={40} />
            <LoadableText placeholderLength={20} />
            <LoadableText placeholderLength={36} />
            <LoadableText placeholderLength={16} />
            <LoadableText placeholderLength={44} />
            <LoadableText placeholderLength={30} />
            <LoadableText placeholderLength={25} />
            <LoadableText placeholderLength={28} />
            <LoadableText placeholderLength={33} />
            <LoadableText placeholderLength={18} />
            <LoadableText placeholderLength={60} />
            <LoadableText placeholderLength={60} />
            <LoadableText placeholderLength={40} />
        </div>
    );
}