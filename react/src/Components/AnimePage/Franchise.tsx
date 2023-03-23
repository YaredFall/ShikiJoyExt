import { Disclosure } from '@headlessui/react';
import { FC } from 'react';
import { FranchiseData } from "../../types";
import { Link } from "react-router-dom";
import styles from "./Franchise.module.scss";

type FranchiseProps = {
    franchise: FranchiseData | undefined
}

const Franchise: FC<FranchiseProps> = ({ franchise }) => {
    return franchise ? (
        <section className={styles.container}>
            <Disclosure>
                <Disclosure.Button className={styles.button}>
                    Это аниме состоит из:
                </Disclosure.Button>
                <Disclosure.Panel className={styles.panel}>
                    <ol className={styles.list}>
                        {franchise?.map((e, i) =>
                            <li key={i} className={!e.url ? styles.current : undefined}>
                                <Link to={e.url || ""} children={e.label} aria-disabled={!e.url} tabIndex={!e.url ? -1 : undefined}/>
                            </li>)
                        }
                    </ol>
                </Disclosure.Panel>
            </Disclosure>
        </section>
    ) : null;
};

export default Franchise;