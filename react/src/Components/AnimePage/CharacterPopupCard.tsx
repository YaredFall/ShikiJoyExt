import { FC, Fragment, RefObject, useRef } from 'react';
import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "../../Api/_config";
import styles from "./PopupCard.module.scss";
import LoadingPage from "../../Pages/LoadingPage";
import { parseShikimoriDescription } from "../../Utils/misc";
import { Link } from "react-router-dom";
import PopupWithTrigger from "../Common/PopupWithTrigger";
import { ErrorBoundary } from "react-error-boundary";
import Spoiler from "../Common/Spoiler";
import { useHoverTrigger } from "../../Hooks/useHoverTrigger";
import SeyuPopupCard from "./SeyuPopupCard";
import Picture from "../Common/Picture";

type CharacterLargeCardProps = {
    id: number | undefined
    bindNode: RefObject<HTMLElement>
}

const CharacterPopupCard: FC<CharacterLargeCardProps> = ({ id, bindNode }) => {

    const [isQueryEnabled] = useHoverTrigger(bindNode);

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

    return (
        <PopupWithTrigger triggerRef={bindNode} containerClassName={`${styles.container} ${styles.character}`}>
            <ErrorBoundary fallback={<div className={styles.error}>Произошла непредвиденная ошибка!</div>}>
                {data ? <Card data={data} /> : <LoadingPage fullscreen={false} />}
            </ErrorBoundary>
        </PopupWithTrigger>
    );
};

export default CharacterPopupCard;

function Card({ data }: { data: any }) {

    const seyuRef = useRef(null);

    return (
        <>
            <Link className={styles.imgLink} to={ApiLinks.get("shikimori") + data.url}>
                <Picture className={styles.mainImage} src={ApiLinks.get("shikimori") + data.image.original} alt={""} />
            </Link>
            <div className={styles.titleAndDesc}>
                <h4 className={styles.name} children={data.russian || data.name} />
                <Desc desc={data?.description} />
            </div>
            <div className={styles.animeAndSeyu}>
                <div>
                    <h5>Аниме</h5>
                    <a href={ApiLinks.get("shikimori") + data.animes[0].url} title={data.animes[0].russian}>
                        <Picture src={ApiLinks.get("shikimori") + data.animes[0].image.x96} alt={""} />
                    </a>
                </div>
                {data.seyu[0] && data.seyu[0].russian &&
                    <div>
                        <h5>Сейю</h5>
                        <a ref={seyuRef} href={ApiLinks.get("shikimori") + data.seyu[0].url} title={data.seyu[0].russian}>
                            <Picture src={ApiLinks.get("shikimori") + data.seyu[0].image.x96} alt={""} />
                        </a>
                        <SeyuPopupCard id={data.seyu[0].id} bindNode={seyuRef} />
                    </div>
                }
            </div>
        </>
    );
}

function Desc({ desc }: { desc: string | undefined }) {

    const parsedDesc = parseShikimoriDescription(desc);

    return (
        <div className={styles.desc}
             children={parsedDesc ? parsedDesc.map((e, i) => <DescParagraph key={i} parsedDescItem={e} />)
                                  : "Описание отсутствует"
             }
        />
    );
}

function DescParagraph({ parsedDescItem }: { parsedDescItem: Exclude<ReturnType<typeof parseShikimoriDescription>, undefined>[number] }) {
    return (
        <>
            {parsedDescItem.type === "spoiler"
             ?
             <Spoiler label={parsedDescItem.label || "Спойлер"}
                      children={parsedDescItem.children.map((n, i) => <DescParagraphItem node={n} key={i} />)}
             />
             :
             <p children={parsedDescItem.children.map((n, i) => <DescParagraphItem node={n} key={i} />)} />
            }
        </>
    );
}

function DescParagraphItem({ node }: { node: Exclude<ReturnType<typeof parseShikimoriDescription>, undefined>[number]["children"][number] }) {
    const linkRef = useRef(null);

    if (node.type === "character") {
        const url = ApiLinks.get("shikimori") + "/characters/" + node.id;
        return (
            <Fragment>
                <Link ref={linkRef} to={url} children={node.content} />
                <CharacterPopupCard id={+node.id!} bindNode={linkRef} />
            </Fragment>
        );
    }
    
    if (node.type === "url") {
        return <a className={styles.alias} target={"_blank"} href={node.link} children={node.content} />
    }

    return <span children={node.content} />;
}