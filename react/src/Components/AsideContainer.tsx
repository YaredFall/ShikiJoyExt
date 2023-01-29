import { FC, ReactNode } from 'react';
import styles from './AsideContainer.module.scss'

type AsideContainerProps = {
    children: ReactNode
}

const AsideContainer:FC<AsideContainerProps> = ({ children }) => {
    return (
        <aside className={styles.asideContainer} children={children} />
    );
};

export default AsideContainer;