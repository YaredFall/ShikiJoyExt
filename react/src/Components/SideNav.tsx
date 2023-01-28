import { FC } from 'react';
import { Link } from "react-router-dom";
import { appRoutes } from "../Utils/appRoutes";
import radishIcon from "../Assets/images/radish256x256.png"
import { IoSettingsOutline } from "react-icons/all";
import styles from "./SideNav.module.scss"

type SideNavProps = {
    
}

const SideNav:FC<SideNavProps> = () => {
    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navbar}>
                <Link className={styles.navlink} to={appRoutes.home} children={<img src={radishIcon} title={"Главная"} alt={"Главная"} />} />
                <Link className={styles.navlink} to={appRoutes.test} children={<div>Test</div>} />
                <Link className={styles.navlink} to={appRoutes.nonexistent} children={<div>Nonexistent</div>} />
                <Link className={`${styles.navlink} ${styles.bottom}`} to={""} children={<IoSettingsOutline />} />
            </nav>
        </header>
    );
};

export default SideNav;