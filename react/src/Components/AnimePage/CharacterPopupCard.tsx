import { FC, Fragment, RefObject, useEffect, useRef, useState } from 'react';
import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "../../Api/_config";
import styles from "./CharacterPopupCard.module.scss";
import LoadingPage from "../../Pages/LoadingPage";
import { parseShikimoriDescription } from "../../Utils/misc";
import { Link } from "react-router-dom";
import PopupWithTrigger from "../PopupWithTrigger";

type CharacterLargeCardProps = {
    id: number | undefined
    bindNode: RefObject<HTMLElement>
}

const CharacterPopupCard: FC<CharacterLargeCardProps> = ({ id, bindNode }) => {
    
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    const { data } = useQuery(
        ["shikimori", "character", id],
        () => {
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/characters/${id}`)
                .json<any>();
        },
        {
            ...defautlQueryConfig,
            enabled: isQueryEnabled
        }
    );

    let timeout: number | undefined = undefined;
    const onMouseEnter = () => {
        timeout = setTimeout(() => {
            setIsQueryEnabled(true);
        }, 500);
    };
    const onMouseLeave = () => {
        clearTimeout(timeout);
    };

    useEffect(() => {
        bindNode.current?.addEventListener("mouseenter", onMouseEnter)
        bindNode.current?.addEventListener("mouseleave", onMouseLeave)
    }, [bindNode]);
    

    return (
        <PopupWithTrigger triggerRef={bindNode} containerClassName={styles.container}>
            {data ? <Card data={data} /> : <LoadingPage fullscreen={false} />}
        </PopupWithTrigger>
    );
};

export default CharacterPopupCard;

function Card({ data }: { data: any }) {
    return (
        <>
            {/*<img src={"https://shikimori.one" + data.image.original} alt={""} />*/}
            <div className={styles.charTitleAndDesc}>
                <h4 className={styles.name} children={data.russian || data.name} />
                <Desc desc={data?.description} />
            </div>
            <div className={styles.animeAndSeyu}>
                <div>
                    <h5>Аниме</h5>
                    <a href={"https://shikimori.one" + data.animes[0].url} title={data.animes[0].russian}>
                        <img src={"https://shikimori.one" + data.animes[0].image.x96} alt={""} />
                    </a>
                </div>
                {data.seyu[0] &&
                    <div>
                        <h5>Сейю</h5>
                        <a href={"https://shikimori.one" + data.seyu[0].url} title={data.seyu[0].russian}>
                            <img src={"https://shikimori.one" + data.seyu[0].image.x96} alt={""} />
                        </a>
                    </div>
                }
            </div>
        </>
    );
}

function Desc({ desc }: { desc: string | undefined }) {
    return (
        <div className={styles.desc} children={desc ? parseShikimoriDescription(desc)?.map((e, i) =>
                                                        e.type === "spoiler" ? <p key={i} className={"spoiler"} children={(<DescParagraphs parsedNode={e.children} />)} />
                                                                             : <p key={i} children={(<DescParagraphs parsedNode={e.children} />)} />
                                                    )
                                                    : "Описание отсутствует"}
        />
    );
}

function DescParagraphs({ parsedNode }: { parsedNode: { type: string, id: string | undefined, content: string }[] }) {
    return (
        <>
            {parsedNode.map((n, i) => <DescParagraphItem node={n} key={i} />)}
        </>
    );
}

function DescParagraphItem({ node }: { node: { type: string, id: string | undefined, content: string } }) {

    let url = undefined;
    if (node.type === "character") {
        url = "https://shikimori.one/characters/" + node.id;
    }
    const linkRef = useRef(null);

    return (url ? <Fragment>
                    <Link ref={linkRef} to={url} children={node.content} />
                    <CharacterPopupCard id={+node.id!} bindNode={linkRef} />
                </Fragment>
                : <span children={node.content} />);
}