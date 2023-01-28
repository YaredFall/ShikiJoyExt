import { FC, ReactNode } from 'react';
import styles from "./MainContainer.module.scss"

type MainContainerProps = {
    children: ReactNode
}

const MainContainer:FC<MainContainerProps> = ({ children}) => {
    return (
        <main className={styles.mainContainer} children={children} />
    );
};

export default MainContainer;