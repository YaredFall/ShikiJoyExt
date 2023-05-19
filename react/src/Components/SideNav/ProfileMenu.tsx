import React, { FC } from 'react';
import styles from "./SideNav.module.scss";
import { Dialog } from "@headlessui/react";
import { IoIosLogIn, TfiClose } from "react-icons/all";
import { Form, Link } from "react-router-dom";
import { ShikimoriUser } from "../../types";
import { getAnimejoyUserFromHeader } from "../../Utils/scraping";
import ky from "ky";
import { openLogInPopup } from "../../Utils/openLogInPopup";
import { ApiLinks } from "../../Api/_config";
import { useQueryClient } from "react-query";
import { useGlobalLoadingStore } from "../../Store/globalLoadingStore";

type UserMenuProps = {
    isDialogOpen: boolean,
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>,
    shikimoriUser: ShikimoriUser | null | undefined,
    animejoyUser: ReturnType<typeof getAnimejoyUserFromHeader>
}

const ProfileMenu: FC<UserMenuProps> = ({ isDialogOpen, setIsDialogOpen, shikimoriUser, animejoyUser }) => {

    const queryClient = useQueryClient();

    const increaseLoadingCount = useGlobalLoadingStore(state => state.increase);
    const decreaseLoadingCount = useGlobalLoadingStore(state => state.decrease);

    async function animejoyLogIn(e: React.MouseEvent) {
        e.preventDefault();
        increaseLoadingCount();
        try {
            await ky.post(window.location.pathname, {
                body: new FormData(document.querySelector("form")!)
            });
            await queryClient.refetchQueries(['animejoy', "page", window.location.pathname]);
        } catch (err) {
            console.error(err);
        }
        decreaseLoadingCount();
    }

    async function animejoyLogOut() {
        increaseLoadingCount();
        try {
            await ky.get("https://animejoy.ru/index.php?action=logout");
            await queryClient.refetchQueries(['animejoy', "page", window.location.pathname]);
        } catch (err) {
            console.error(err);
        }
        decreaseLoadingCount();
    }

    async function shikimoriLogIn() {
        await openLogInPopup(
            () => increaseLoadingCount(),
            () => queryClient.invalidateQueries(["shikimori", "whoami"])
        );
    }

    async function shikimoriLogOut() {
        increaseLoadingCount();
        await ky.post(ApiLinks.get(import.meta.env.DEV ? "dev/shikijoy" : "shikijoy") + "api/shikimori/auth/logout", {
            credentials: "include"
        });
        queryClient.setQueryData(["shikimori", "whoami"], null);
        decreaseLoadingCount();
    }

    return (
        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className={styles.profileModal}>
            <div className={styles.backdrop} aria-hidden="true" />
            <Dialog.Panel className={styles.dialogPanel}>
                <div className={styles.profilePanel}>
                    <h3 children={"Профиль Shikimori"} />
                    {shikimoriUser ?
                        <>
                            <a href={shikimoriUser?.url} target={"_blank"}>
                                <img src={shikimoriUser.image.x160} alt={""} />
                                <p children={shikimoriUser?.nickname || "Войти"} />
                            </a>
                            <div className={styles.additionalOptions}>
                                <button onClick={shikimoriLogOut}>Выйти</button>
                            </div>
                        </>
                        :
                        <>
                            <button onClick={shikimoriLogIn}>
                                <IoIosLogIn />
                                <span>Войти</span>
                            </button>
                            <div className={styles.additionalOptions}>
                                <a href={"https://shikimori.me/users/sign_up"} target={"_blank"}>Регистрация</a>
                            </div>
                        </>
                    }
                </div>
                <div className={styles.profilePanel}>
                    <h3 children={"Профиль AnimeJoy"} />
                    {animejoyUser ?
                        <>
                            <Link to={animejoyUser?.url || "/tbd"}>
                                <img src={animejoyUser.avatar} alt={""} />
                                <p children={animejoyUser?.nickname || "Войти"} />
                            </Link>
                            <div className={styles.additionalOptions}>
                                <button onClick={animejoyLogOut}>Выйти</button>
                            </div>
                        </>
                        :
                        <>
                            <Form method={"post"}>
                                <input name={"login_name"} placeholder={"Логин"} type={"text"} />
                                <input name={"login_password"} placeholder={"Пароль"} type={"password"} />
                                <button type={"submit"} onClick={animejoyLogIn}>
                                    <IoIosLogIn />
                                    <span>Войти</span>
                                </button>
                                <input name={"login"} type={"hidden"} value={"submit"} />
                            </Form>
                            <div className={styles.additionalOptions}>
                                <Link to={"/index.php?do=register"}>Регистрация</Link>
                                <Link to={"/index.php?do=lostpassword"}>Забили пароль?</Link>
                            </div>
                        </>

                    }
                </div>
                <button className={styles.closeDialogBtn} onClick={() => setIsDialogOpen(false)} children={<TfiClose />} />
            </Dialog.Panel>
        </Dialog>
    );
};

export default ProfileMenu;