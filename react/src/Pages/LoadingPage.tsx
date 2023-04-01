import { FC } from 'react';
import styles from "./LoadingPage.module.scss"
import radishIcon from "/images/radish256x256.png";

//@ts-ignore
const radishIconExt = chrome.runtime?.getURL("bundled/images/radish256x256.png");

type LoadingPageProps = {
    fullscreen?: boolean
}

const LoadingPage:FC<LoadingPageProps> = ({ fullscreen = true}) => {
    return (
        <div className={`loader ${styles.container}`}>
            <img className={styles.logo} src={radishIconExt || radishIcon} alt={"Лого"} />
        </div>
    );
};

export default LoadingPage;