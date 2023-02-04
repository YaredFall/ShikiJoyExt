import { FC } from 'react';
import styles from './DotSplitter.module.scss'

type DotSplitterProps = {
    className?: string
}

const DotSplitter: FC<DotSplitterProps> = ({ className }) => {
    return (
        <div className={`${styles.splitter} ${className}`} />
    );
};

export default DotSplitter;