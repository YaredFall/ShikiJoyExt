import React, { FC, memo, RefObject, useContext } from 'react';
import styles from "./Player.module.scss";
import { NestedChildrenMemoPolymorphicComponent as Section } from "../../Common/PolymorphicComponent";
import { SlArrowLeft } from "react-icons/sl";
import { PlayerContext } from "./Player";

const MemoizedLeftIcon = memo(SlArrowLeft);


type LeftButtonProps = {
    buttonRef?: RefObject<HTMLButtonElement>
}

const LeftButton: FC<LeftButtonProps> = ({ buttonRef }) => {

    const {
        canChangeEpisodeId,
        changeEpisodeId
    } = useContext(PlayerContext);

    return (
        <Section as={"button"}
                 ref={buttonRef}
                 className={`${styles.leftSection}${!canChangeEpisodeId("prev") ? " hide" : " show"}`}
                 onClick={() => {
                     changeEpisodeId("prev");
                 }}
                 disabled={!canChangeEpisodeId("prev")}
        >
            <div className={styles.wrapper}>
                <MemoizedLeftIcon />
                <div className={styles.hint} children={"Предыдущая серия"} />
            </div>
        </Section>
    );
};

export default LeftButton;