import { CSSProperties, Dispatch, FC, SetStateAction, useCallback, useLayoutEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import styles from "./SideNav.module.scss";
import { Categories } from "../Utils/appRoutes";

type NavMenuProps = {
    className?: string
    isOpen: boolean,
    setIsOpen?: Dispatch<SetStateAction<boolean>>;
}

const MenuNav: FC<NavMenuProps> = ({ className, isOpen, setIsOpen }) => {

    const { pathname: path } = useLocation();
    
    const [isClosed, setIsClosed] = useState(true);

    const onTransitionEnd = useCallback(() => {
        setIsClosed(!isOpen);
    }, [isOpen]);

    const onClick = useCallback(() => {
        setIsOpen && setIsOpen(false);
    }, [setIsOpen]);


    useLayoutEffect(() => {
        if (isClosed && isOpen) {
            setIsClosed(!isOpen);
        }
    }, [isOpen]);


    return (
        <nav className={className + (isClosed ? " remove" : "")} onTransitionEnd={onTransitionEnd}>
            {[...Categories.entries()].map((t, i) => {
                    const isActive = path === '/' + t[1] || path.startsWith(`${t[1]}/page/`) || path.startsWith(`/${t[1]}/page/`);
                    return (
                        <NavLink key={t[0]}
                                 style={{ "--i": i } as CSSProperties}
                                 onClick={onClick}
                                 to={(t[0] === "Главная" ? t[1] : `/${t[1]}/`)}
                                 children={t[0]}
                                 className={isActive ? styles.active : undefined}
                                 tabIndex={isActive ? -1 : undefined}
                        />
                    );
                }
            )}
        </nav>
    );
};

export default MenuNav;