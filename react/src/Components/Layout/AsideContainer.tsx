import { FC, ReactNode, useEffect, useState } from 'react';
import styles from './AsideContainer.module.scss'


// 84px + 50rem + 29rem
const LAYOUT_BREAKPOINT_WIDTH = 84 + 79*16;

type AsideContainerProps = {
    children: ReactNode
}

const AsideContainer:FC<AsideContainerProps> = ({ children }) => {

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handler = () => {
            setWindowWidth(window.innerWidth)
        };
        window.addEventListener("resize", handler);
        
        return () => {
            window.removeEventListener("resize", handler);
        }
    }, []);
    

    return (
        windowWidth >= LAYOUT_BREAKPOINT_WIDTH ? <aside className={styles.asideContainer} children={children} /> : null
    );
};

export default AsideContainer;