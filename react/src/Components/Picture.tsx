import {
    DetailedHTMLProps,
    FC,
    HTMLProps,
    ImgHTMLAttributes,
    SyntheticEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from 'react';
import styles from './Picture.module.scss';

type PictureProps = DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>

const Picture: FC<PictureProps> = ({
    src,
    className,
    onLoad,
    alt,
    ...otherProps
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

    const onLoadHandler = useCallback((e: SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoading(false);
        if (src) {
            loadedImages.current.add(src);
        }
        onLoad && onLoad(e)
    }, [src]);

    const onTransitionEnd = useCallback(() => {
            setShouldRenderPlaceholder(false);
        }, [],
    );

    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <img alt={alt ?? "pic"} onLoad={onLoadHandler} src={src} className={`${styles.image} ${isLoading ? styles.loading : ""}`} {...otherProps}/>
            { shouldRenderPlaceholder &&
                <div onTransitionEnd={onTransitionEnd} className={`${styles.placeholder} ${isLoading ? "" : styles.hide}`} />
            }
        </div>
    );
};

export default Picture;