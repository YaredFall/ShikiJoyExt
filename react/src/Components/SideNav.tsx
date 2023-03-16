import { FC } from 'react';
import { NavLink } from "react-router-dom";
import { appRoutes } from "../Utils/appRoutes";
import radishIcon from "/images/radish256x256.png";
import { VscHistory, IoIosLogIn, IoSearchOutline, IoSettingsOutline, TbList } from "react-icons/all";
import styles from "./SideNav.module.scss";

//@ts-ignore
const radishIconExt = chrome.runtime?.getURL("bundled/images/radish256x256.png");

type SideNavProps = {}

const SideNav: FC<SideNavProps> = () => {

    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navbar}>
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={appRoutes.home}
                         data-label={"Главная"}
                         children={<img className={styles.radish} src={radishIconExt || radishIcon} alt={"Лого"} />}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Поиск"}
                         children={<IoSearchOutline />}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Мой список"}
                         children={<TbList />}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${styles.smaller} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Последнее"}
                         children={<VscHistory />}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={appRoutes.test}
                         children={<div>Test</div>}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={appRoutes.test2}
                         children={<div>Test 2</div>}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={appRoutes.nonexistent}
                         children={<div>404</div>}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${styles.bottom} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Вход"}
                         children={<IoIosLogIn />}
                />
                <NavLink className={({ isActive }) => `${styles.navlink} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Настройки"}
                         children={<IoSettingsOutline />}
                />
            </nav>
        </header>
    );
};

export default SideNav;