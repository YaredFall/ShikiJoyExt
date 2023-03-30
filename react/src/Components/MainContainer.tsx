import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import styles from "./MainContainer.module.scss"
import { useLocation } from "react-router-dom";

type MainContainerProps = {
    children: ReactNode
}

const MainContainer:FC<MainContainerProps> = ({ children}) => {

    const location = useLocation()
    
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        ref.current?.scroll({top: 0})
    }, [location]);
    
    return (
        <main ref={ref} className={styles.mainContainer} children={children} />
    );
};

export default MainContainer;