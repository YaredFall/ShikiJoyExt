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

const MAX_RETRIES = 3;

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
        onLoad && onLoad(e);
    }, [src]);

    const onTransitionEnd = useCallback(() => {
        setShouldRenderPlaceholder(false);
    }, []);


    let interval: number | undefined;
    const imgRef = useRef<HTMLImageElement>(null);
    const onError = useCallback(() => {
        if (interval) return;
        
        let retryNumber = 1;
        interval = setInterval(() => {
            if (retryNumber > MAX_RETRIES) {
                clearInterval(interval);
                return;
            }

            retryNumber += 1;
            console.warn("Image load failed", interval);
            if (imgRef.current) {
                imgRef.current.src = src || "";
                clearInterval(interval);
                console.log(`image ${src} loaded after ${retryNumber} retries`)
            }
        }, 500 * retryNumber * retryNumber);
    }, []);


    return (
        <div className={`${styles.container} ${className ? className : ""}`}>
            <img ref={imgRef}
                 alt={alt ?? "pic"}
                 onError={onError}
                 onLoad={onLoadHandler}
                 src={src}
                 className={`${styles.image} ${isLoading ? styles.loading : ""}`} {...otherProps} />
            {shouldRenderPlaceholder &&
                <div onTransitionEnd={onTransitionEnd} className={`${styles.placeholder} ${isLoading ? "" : styles.hide}`} />
            }
        </div>
    );
};

export default Picture;