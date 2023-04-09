import { FC, ReactNode } from 'react';
import styles from "./LoadableText.module.scss";

type LoadableTextProps = {
    children?: ReactNode
    placeholderLength?: number
    isLoading?: string
}

const LoadableText:FC<LoadableTextProps> = ({children, isLoading, placeholderLength= 5}) => {

    if (!children || isLoading)
    return (
        <span className={styles.fakeText} children={"x".repeat(placeholderLength)} />
    );

    return (
        <span children={children} />
    );
};

export default LoadableText;