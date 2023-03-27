import { FC, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './Picture.module.scss';

type PictureProps = {
    src?: string
    className?: string
}

const Picture: FC<PictureProps> = ({
    src,
    className
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [shouldRenderPlaceholder, setShouldRenderPlaceholder] = useState(true);

    const loadedImages = useRef(new Set<string>());

    useLayoutEffect(() => {
        if (!src || !loadedImages.current.has(src)) {
            setIsLoading(true);
            setShouldRenderPlaceholder(true);
        }
    }, [src]);

    const onLoad = useCallback(() => {
        setIsLoading(false);
        if (src) {
            loadedImages.current.add(src);
        }
    }, [src]);

    const onTransitionEnd = useCallback(() => {
            setShouldRenderPlaceholder(false);
        }, [],
    );

    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <img alt={"pic"} onLoad={onLoad} src={src} className={`${styles.image} ${isLoading ? styles.loading : ""}`} />
            { shouldRenderPlaceholder &&
                <div onTransitionEnd={onTransitionEnd} className={`${styles.placeholder} ${isLoading ? "" : styles.hide}`} />
            }
        </div>
    );
};

export default Picture;