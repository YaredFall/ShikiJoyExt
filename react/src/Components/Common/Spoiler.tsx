import { Disclosure, Transition } from '@headlessui/react';
import { FC, Fragment, ReactNode } from 'react';
import { SlArrowDown } from "react-icons/sl";
import styles from "./Spoiler.module.scss";

type SpoilerProps = {
    label?: string
    children?: ReactNode
}

const Spoiler: FC<SpoilerProps> = ({ label, children }) => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className={`${styles.button} ${open ? styles.open : ""}`}>
                        <span children={label} />
                        <SlArrowDown />
                    </Disclosure.Button>
                    <Transition as={Fragment}
                        enterTo={styles.open}
                        leaveTo={styles.closed}
                    >
                        <Disclosure.Panel as={"p"} className={styles.content}>
                            {children}
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    );
};

export default Spoiler;