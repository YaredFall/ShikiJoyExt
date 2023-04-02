import { Dispatch, FC, RefObject, SetStateAction, useEffect, useState } from 'react';
import { useQuery } from "react-query";
import ky from "ky";
import { ApiLinks, defautlQueryConfig } from "../../Api/_config";
import styles from "./CharacterPopupCard.module.scss";
import LoadingPage from "../../Pages/LoadingPage";
import PopupPortal from "../PopupPortal";

type CharacterLargeCardProps = {
    isOpen: boolean
    setIsInside?: Dispatch<SetStateAction<boolean>>
    id: number | undefined
    bindNode?: RefObject<any>
}

const CharacterPopupCard: FC<CharacterLargeCardProps> = ({ isOpen, id, bindNode, setIsInside }) => {

    const { data } = useQuery(
        ["shikimori", "character", id],
        () => {
            return ky((import.meta.env.DEV ? ApiLinks.get("dev/shikijoy") : ApiLinks.get("shikijoy")) + `api/shikimori/characters/${id}`)
                .json();
        },
        {
            ...defautlQueryConfig,
            enabled: isOpen
        }
    );

    const [position, setPosition] = useState({
        top: bindNode?.current?.getBoundingClientRect().top + document.documentElement.scrollTop,
        left: bindNode?.current?.getBoundingClientRect().right
    });

    useEffect(() => {
        const handler = () => {
            bindNode && setPosition(prev => ({
                top: bindNode.current.getBoundingClientRect().top + document.documentElement.scrollTop,
                left: bindNode.current.getBoundingClientRect().right
            }));
        };
        handler();
        window.addEventListener("resize", handler, true);
        return () => {
            window.removeEventListener("resize", handler, true);
        };
    }, []);

    let timeout: number | undefined = undefined;

    return (
        <PopupPortal isOpen={isOpen}>
            <div className={styles.container}
                 style={{ top: position.top + "px", left: position.left + "px" }}
                 onMouseOver={() => {
                     clearTimeout(timeout);
                     setIsInside && setIsInside(true);
                 }}
                 onMouseLeave={() => {
                     timeout = setTimeout(() => {
                         setIsInside && setIsInside(false);
                     }, 500);
                 }}
            >
                {data ? <Card data={data} /> : <LoadingPage fullscreen={false} />}
            </div>
        </PopupPortal>
    );
};

export default CharacterPopupCard;

function Card({ data }: { data: any }) {
    return (
        <>
            {/*<img src={"https://shikimori.one" + data.image.original} alt={""} />*/}
            <div className={styles.charDesc}>
                <h4 className={styles.name} children={data.russian || data.name} />
                <p children={data.description || "Описание отсутствует"} />
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