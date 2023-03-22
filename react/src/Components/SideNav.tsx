import { FC } from 'react';
import { NavLink } from "react-router-dom";
import { appRoutes } from "../Utils/appRoutes";
import radishIcon from "/images/radish256x256.png";
import { VscHistory, IoIosLogIn, IoSearchOutline, IoSettingsOutline, TbList } from "react-icons/all";
import styles from "./SideNav.module.scss";
import { openLogInPopup } from "../Utils/openLogInPopup";
import { useGetShikimoriUser } from "../Api/useGetShikimoriUser";
import { useQueryClient } from "react-query";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";

//@ts-ignore
const radishIconExt = chrome.runtime?.getURL("bundled/images/radish256x256.png");

type SideNavProps = {}

const SideNav: FC<SideNavProps> = () => {

    const queryClient = useQueryClient();

    const { data: user } = useGetShikimoriUser(true);

    const increaseLoadingCount = useGlobalLoadingStore(state => state.increase);

    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navbar}>
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                         to={appRoutes.home}
                         data-label={"Главная"}
                         children={<img className={styles.radish} src={radishIconExt || radishIcon} alt={"Лого"} />}
                />
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                         to={"tbd"}
                         data-label={"Поиск"}
                         children={<IoSearchOutline />}
                />
                {user ? <a className={`${styles.navItem} ${styles.external}`}
                                 target={"_blank"}
                                 href={user.url + "/list/anime"}
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
                <NavLink className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}
                         to={appRoutes.nonexistent}
                         children={<div>404</div>}
                />
                {user ? <a className={`${styles.navItem} ${styles.bottom} ${styles.external}`}
                           target={"_blank"}
                           href={user?.url}
                           data-label={"Профиль"}
                           children={<img className={styles.avatar} src={user.avatar} alt={""} />}
                      />
                      : <button className={`${styles.navItem} ${styles.bottom}`}
                                onClick={() => openLogInPopup(
                                    () => increaseLoadingCount(),
                                    () => queryClient.invalidateQueries(["shikimori", "whoami"])
                                )}
                                data-label={"Вход"}
                                children={<IoIosLogIn />}
                 />
                }
                <NavLink className={styles.navItem}
                         to={"tbd"}
                         data-label={"Настройки"}
                         children={<IoSettingsOutline />}
                />
            </nav>
        </header>
    );
};

export default SideNav;