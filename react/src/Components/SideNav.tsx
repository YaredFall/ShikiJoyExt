import { FC } from 'react';
import { Link } from "react-router-dom";
import { appRoutes } from "../Utils/appRoutes";
import radishIcon from "/images/radish256x256.png"
import { IoSettingsOutline } from "react-icons/all";
import styles from "./SideNav.module.scss"

//@ts-ignore
const radishIconExt = chrome.runtime?.getURL("react/dist/images/radish256x256.png")

type SideNavProps = {
    
}

const SideNav:FC<SideNavProps> = () => {
    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navbar}>
                <Link className={styles.navlink} to={appRoutes.home} children={<img src={radishIconExt || radishIcon} title={"Главная"} alt={"Главная"} />} />
                <Link className={styles.navlink} to={appRoutes.test} children={<div>Test</div>} />
                <Link className={styles.navlink} to={appRoutes.test2} children={<div>Test 2</div>} />
                <Link className={styles.navlink} to={appRoutes.nonexistent} children={<div>Nonexistent</div>} />
                <Link className={`${styles.navlink} ${styles.bottom}`} to={""} children={<IoSettingsOutline />} />
            </nav>
        </header>
    );
};

export default SideNav;