import { FC, memo, useLayoutEffect, useRef, useState } from 'react';
import { NavLink } from "react-router-dom";
import { appRoutes } from "../../Utils/appRoutes";
import radishIcon from "/images/radish256x256.png";
import { IoSearchOutline, IoSettingsOutline } from "react-icons/io5";
import { TbList } from "react-icons/tb";
import { TfiClose } from "react-icons/tfi";
import { VscHistory } from "react-icons/vsc";
import styles from "./SideNav.module.scss";
import { useGetShikimoriUser } from "../../Api/useGetShikimoriUser";
import MenuNav from "./MenuNav";
import ProfileButton from "./ProfileButton";

//@ts-ignore
const radishIconExt = chrome.runtime?.getURL("bundled/images/radish256x256.png");


const MemoizedCrossIcon = memo(TfiClose);

type SideNavProps = {};

const SideNav: FC<SideNavProps> = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const { data: shikimoriUser } = useGetShikimoriUser(true);

    const onMenuToggleClick = () => {
        setIsMenuOpen(prevState => !prevState);
    };

    return (
        <header className={styles.headerContainer} id={"side-nav"}>
            <nav className={styles.navbar}>
                <div>
                    <button className={`${styles.navItem} ${styles.menuButton} ${isMenuOpen ? styles.open : ""}`}
                        data-label={isMenuOpen ? "Закрыть" : "Меню"}
                        onClick={onMenuToggleClick}
                    >
                        <div className={`${styles.radish}`}>
                            <img className={styles.radish} src={radishIconExt || radishIcon} alt={"Лого"} />
                            <div className={styles.title} children={"ShikiJoy"} />
                        </div>
                        <div className={`${styles.closeMenu}`}
                            children={<MemoizedCrossIcon />}
                        />
                    </button>
                    <MenuNav className={`${styles.menu} ${isMenuOpen ? styles.open : styles.closed}`}
                        isOpen={isMenuOpen}
                        setIsOpen={setIsMenuOpen}
                    />
                </div>
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                    to={"/search"}
                    data-label={"Поиск"}
                    children={<IoSearchOutline />}
                />
                {shikimoriUser ? <a className={`${styles.navItem} ${styles.external}`}
                    target={"_blank"}
                    href={shikimoriUser.url + "/list/anime"}
                    data-label={"Мой список"}
                    children={<TbList />}
                />
                    : null
                }
                <NavLink className={({ isActive }) => `${styles.navItem} ${styles.smaller} ${isActive ? styles.active : ""}`}
                    to={"tbd"}
                    data-label={"Последнее"}
                    children={<VscHistory />}
                />
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                    to={appRoutes.test}
                    children={<div>Test</div>}
                />
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                    to={appRoutes.test2}
                    children={<div>Test 2</div>}
                />
                <div className={styles.bottomNav}>
                    <ProfileButton shikimoriUser={shikimoriUser} />
                    <NavLink className={styles.navItem}
                        to={"tbd"}
                        data-label={"Настройки"}
                        children={<IoSettingsOutline />}
                    />
                </div>
            </nav>
        </header>
    );
};

export default SideNav;