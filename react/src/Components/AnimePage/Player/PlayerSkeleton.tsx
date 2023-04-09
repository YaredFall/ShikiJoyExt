import React, { FC } from 'react';
import styles from "./Player.module.scss";
import { NestedChildrenMemoPolymorphicComponent as Section } from "../../Common/PolymorphicComponent";
import PlayerSelect from "./PlayerSelect";
import PlayerMiddleSection from "./PlayerMiddleSection";
import LoadableText from "../../Common/LoadableText";


type PlayerSkeletonProps = {

}

const PlayerSkeleton:FC<PlayerSkeletonProps> = () => {
    return (
        <div className={styles.player}>
            <Section className={styles.topSection}>
                <div className={`${styles.currentEpLabel}`}>
                    <LoadableText placeholderLength={7} />
                </div>
                <PlayerSelect />
            </Section>
            <Section as={"button"}
                     className={`${styles.leftSection} hide`}
                     disabled
            >
                <div className={styles.wrapper}>
                </div>
            </Section>
            <PlayerMiddleSection />
            <Section as={"button"}
                     className={`${styles.rightSection} hide`}
                     disabled
            >
                <div className={styles.wrapper}>
                </div>
            </Section>
        </div>
    );
};

export default PlayerSkeleton;