import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import styles from "./MainContainer.module.scss"
import { useLocation } from "react-router-dom";

type MainContainerProps = {
    children: ReactNode
}

const MainContainer:FC<MainContainerProps> = ({ children}) => {

    const location = useLocation()

    useLayoutEffect(() => {
        scrollTo({top: 0})
    }, [location]);
    
    return (
        <main className={styles.mainContainer} children={children} />
    );
};

export default MainContainer;