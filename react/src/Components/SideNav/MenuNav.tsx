import { CSSProperties, Dispatch, FC, SetStateAction, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { NavLink, useLocation } from "react-router-dom";
import styles from "./SideNav.module.scss";
import { appRoutes, Categories } from "../../Utils/appRoutes";
import { isAnyMetaKeyPressed } from "../../Utils/misc";

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

    const onLinkClick = useCallback(() => {
        setIsOpen && setIsOpen(false);
    }, [setIsOpen]);

    useLayoutEffect(() => {
        if (isClosed && isOpen) {
            setIsClosed(!isOpen);
        }
    }, [isOpen]);


    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!isAnyMetaKeyPressed(e) && e.code === 'Escape' && setIsOpen && isOpen) {
                setIsOpen(false);
                const previouslyFocused = document.activeElement as HTMLElement;
                if (!previouslyFocused) return;

                let newFocusTarget = previouslyFocused;

                if (document.querySelector("#menu-nav")?.contains(previouslyFocused)) {
                    newFocusTarget = document.querySelector("#side-nav button") as HTMLElement;
                }

                setTimeout(() => {
                    newFocusTarget?.focus();
                }, 0);
            }
        };

        document.body.addEventListener("keydown", handler);

        return () => {
            document.body.removeEventListener("keydown", handler);
        };
    }, [setIsOpen, isOpen]);


    return (
        <>
            <nav id={"menu-nav"} className={className + (isClosed ? " remove" : "")} onTransitionEnd={onTransitionEnd}>
                {[...Categories.entries()].map((t, i) => {
                        const isActive = (path === '/' + t[1]) || path === `/${t[1]}/`
                            || path.startsWith(`${t[1]}/page/`) || path.startsWith(`/${t[1]}/page/`);
                        return (
                            <NavLink key={t[0]}
                                     style={{ "--i": i } as CSSProperties}
                                     onClick={onLinkClick}
                                     to={(t[0] === "Главная" ? t[1] : `/${t[1]}/`)}
                                     children={t[0]}
                                     className={isActive ? styles.active : undefined}
                                     tabIndex={isActive ? -1 : undefined}
                            />
                        );
                    }
                )}
                <NavLink style={{ "--i": Categories.size } as CSSProperties}
                         onClick={onLinkClick}
                         to={`/${appRoutes.news}/`}
                         children={"Новости"}
                         className={path === "/news/" ? styles.active : undefined}
                         tabIndex={path === "/news/" ? -1 : undefined}
                />
            </nav>
            <div className={styles.menuBG + (isClosed ? " remove" : "")} onClick={onLinkClick} />
        </>
    );
};

export default MenuNav;