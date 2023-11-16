import { FC, useState } from 'react';
import { IoIosLogIn } from "react-icons/io";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useGetShikimoriUser } from "../../Api/useGetShikimoriUser";
import { getAnimejoyUserFromHeader } from "../../Utils/scraping";
import Picture from "../Common/Picture";
import ProfileMenu from "./ProfileMenu";
import styles from "./SideNav.module.scss";

type UserAvatarProps = {
    shikimoriUser: ReturnType<typeof useGetShikimoriUser>["data"]
}

const ProfileButton: FC<UserAvatarProps> = ({ shikimoriUser }) => {

    const { data: page } = useAnimeJoyAnimePageQuery("/");
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
            <button className={styles.navItem}
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