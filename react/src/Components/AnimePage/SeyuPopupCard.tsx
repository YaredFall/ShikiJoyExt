import { FC, RefObject, useRef } from 'react';
import { useHoverTrigger } from "../../Hooks/useHoverTrigger";
import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "../../Api/_config";
import PopupWithTrigger from "../Common/PopupWithTrigger";
import styles from "./PopupCard.module.scss";
import { ErrorBoundary } from "react-error-boundary";
import LoadingPage from "../../Pages/LoadingPage";
import CharacterPopupCard from "./CharacterPopupCard";

type SeyuPopupCardProps = {
    id: number | undefined
    bindNode: RefObject<HTMLElement>
}

const SeyuPopupCard: FC<SeyuPopupCardProps> = ({ id, bindNode }) => {

    const [isQueryEnabled] = useHoverTrigger(bindNode);

    const { data } = useQuery(
        ["shikimori", "character", id],
        () => {
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/people/${id}`)
                .json<any>();
        },
        {
            ...defautlQueryConfig,
            enabled: isQueryEnabled
        }
    );

    return (
        <PopupWithTrigger triggerRef={bindNode} containerClassName={`${styles.container} ${styles.seyu}`}>
            <ErrorBoundary fallback={<div className={styles.error}>Произошла непредвиденная ошибка!</div>}>
                {data ? <Card data={data} /> : <LoadingPage fullscreen={false} />}
            </ErrorBoundary>
        </PopupWithTrigger>
    );
};

export default SeyuPopupCard;


function Card({ data }: { data: any }) {

    return (
        <>
            <a className={styles.imgLink} href={"https://shikimori.one" + data.url}>
                <img className={styles.mainImage} src={"https://shikimori.one" + data.image.original} alt={""} />
            </a>
            <div className={styles.content}>
                <div className={styles.titleAndDesc}>
                    <h4 className={styles.name} children={data.russian || data.name} />
                    {/*<Desc desc={data?.description} />*/}
                </div>
                <div className={styles.bestRoles}>
                    <h5>Лучшие роли:</h5>
                    <div className={styles.rolesList}>
                        {
                            data.roles.filter((r: any) => r.animes[0].status !== "ongoing").slice(0, 4).map((r: any, i: number) =>
                                <Role roleData={r} key={i} />
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

function Role({ roleData }: { roleData: any }) {
    const triggerRef = useRef(null);

    return (
        <>
            <a href={"https://shikimori.one" + roleData.characters[0].url}>
                <img ref={triggerRef} src={"https://shikimori.one" + roleData.characters[0].image.original} />
            </a>
            <CharacterPopupCard id={roleData.characters[0].id} bindNode={triggerRef} />
        </>
    );
}