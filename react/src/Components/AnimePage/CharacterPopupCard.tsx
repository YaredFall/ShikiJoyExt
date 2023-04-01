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
                     clearTimeout(timeout)
                     setIsInside && setIsInside(true);
                 }}
                 onMouseLeave={() => {
                     timeout = setTimeout(() => {
                         setIsInside && setIsInside(false);
                     }, 500)
                 }}
            >
                {data ? JSON.stringify(data) : <LoadingPage fullscreen={false} />}
            </div>
        </PopupPortal>
    );
};

export default CharacterPopupCard;