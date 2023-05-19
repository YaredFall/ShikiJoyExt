import React, { FC, useState } from 'react';
import styles from "./SideNav.module.scss";
import { IoIosLogIn } from "react-icons/all";
import { useGetShikimoriUser } from "../../Api/useGetShikimoriUser";
import { getAnimejoyUserFromHeader } from "../../Utils/scraping";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import Picture from "../Common/Picture";
import ProfileMenu from "./ProfileMenu";

type UserAvatarProps = {
    shikimoriUser: ReturnType<typeof useGetShikimoriUser>["data"]
}

const ProfileButton: FC<UserAvatarProps> = ({ shikimoriUser }) => {

    const { data: page } = useAnimeJoyAnimePageQuery(window.location.pathname);
    const animejoyUser = getAnimejoyUserFromHeader(page);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    function closeModal() {
        setIsDialogOpen(false);
    }

    function openModal() {
        setIsDialogOpen(true);
    }

    return (
        <>
            <button className={`${styles.navItem} ${styles.bottom}`}
                    onClick={openModal}
                    data-label={shikimoriUser || animejoyUser ? "Профиль" : "Вход"}
            >
                {shikimoriUser || animejoyUser ?
                    <Picture className={styles.avatar}
                             src={shikimoriUser?.avatar || animejoyUser?.avatar}
                             alt={""}
                    />
                    :
                    <IoIosLogIn />}
            </button>
            <ProfileMenu isDialogOpen={isDialogOpen}
                         setIsDialogOpen={setIsDialogOpen}
                         shikimoriUser={shikimoriUser}
                         animejoyUser={animejoyUser}
            />
        </>
    );
};

export default ProfileButton;