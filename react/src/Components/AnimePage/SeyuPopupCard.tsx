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
import Picture from "../Common/Picture";
import { ShikimoriPerson } from "../../types";

type SeyuPopupCardProps = {
    id: number | undefined
    bindNode: RefObject<HTMLElement>
}

const SeyuPopupCard: FC<SeyuPopupCardProps> = ({ id, bindNode }) => {

    const [isQueryEnabled] = useHoverTrigger(bindNode);

    const { data } = useQuery(
        ["shikimori", "person", id],
        () => {
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/people/${id}`)
                .json<ShikimoriPerson>();
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


function Card({ data }: { data: ShikimoriPerson }) {

    return (
        <>
            <a className={styles.imgLink} href={ApiLinks.get("shikimori") + data.url}>
                <Picture className={styles.mainImage} src={ApiLinks.get("shikimori") + data.image.original} alt={""} />
            </a>
            <div className={styles.content}>
                <div className={styles.titleAndDesc}>
                    <h4 className={styles.name} children={data.russian || data.name} />
                    {/*<Desc desc={data?.description} />*/}
                </div>
                <div className={styles.bestRoles}>
                    {/*<h5>Лучшие роли:</h5>*/}
                    <ul className={styles.rolesList}>
                        {
                            data.roles.slice(0, 8).map((r, i) =>
                                <Role roleData={r} key={i} />
                            )
                        }
                    </ul>
                </div>
            </div>
        </>
    );
}

function Role({ roleData }: { roleData: ShikimoriPerson["roles"][number] }) {
    const triggerRef = useRef(null);

    return (
        <li>
            <a ref={triggerRef} href={ApiLinks.get("shikimori") + roleData.characters[0].url}>
                <Picture src={ApiLinks.get("shikimori") + roleData.characters[0].image.original} />
            </a>
            <CharacterPopupCard id={roleData.characters[0].id} bindNode={triggerRef} />
        </li>
    );
}