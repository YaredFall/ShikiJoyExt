import { CSSProperties, FC, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { shikimoriUserRateTranslate } from "../../Utils/misc";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { useShikiJoyAnimeSearch } from "../../Api/useShikiJoyAnimeSearch";
import { getShikimoriID } from "../../Utils/scraping";
import { Disclosure } from '@headlessui/react';
import styles from "./AnimeUserRate.module.scss";
import { CgMathPlus } from "react-icons/cg";
import plural from "plural-ru";
import { useGetShikimoriUser } from "../../Api/useGetShikimoriUser";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { NewRate, useRateMutation } from '../../Hooks/useShikimoriRateMutation';
import { PiSpinnerGapLight } from "react-icons/pi";
import { ShikimoriUserRateStatus } from '../../types';
import { TbStarFilled } from 'react-icons/tb';
import clsx from 'clsx';

type AnimeUserRateProps = {};

const USER_RATE_STATUSES = [
    "completed",
    "dropped",
    "on_hold",
    "planned",
    "rewatching",
    "watching",
];

const USER_RATE_SCORES = [
    "Хуже некуда",
    "Ужасно",
    "Очень плохо",
    "Плохо",
    "Более-менее",
    "Нормально",
    "Хорошо",
    "Отлично",
    "Великолепно",
    "Шедевр"
];

const AnimeUserRate: FC<AnimeUserRateProps> = () => {

    const queryClient = useQueryClient();
    const { id: fullID } = useParams();

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(window.location.pathname);
    const { data: user } = useGetShikimoriUser();

    const shikimoriID = useMemo(() => getShikimoriID(pageDocument), [pageDocument]);

    const {
        data: searchResult,
        isFetching
    } = useShikiJoyAnimeSearch(shikimoriID);

    const data = searchResult?.coreData;

    const translatedStatus = data?.user_rate ? shikimoriUserRateTranslate(data.user_rate.status) : undefined;

    const { mutateAsync: mutateRate, isLoading: isMutatingRate } = useRateMutation();

    function onStatusClick(rate: NewRate) {
        return async () => {
            if (!data || !user) return;
            if (!data.user_rate) {
                await mutateRate({
                    type: "create",
                    rateData: rate
                });
            } else {
                await mutateRate({
                    type: "update",
                    rateID: data.user_rate.id,
                    rateData: rate
                });
            }
            await queryClient.refetchQueries(['shikijoy', 'find', fullID]);
        };
    }

    const popoverRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const focusBlurOnOuterClick = (e: MouseEvent) => {
            if (popoverRef.current?.contains(e.target as Node) && popoverRef.current?.getAttribute("data-headlessui-state") === "") {
                (document.activeElement as HTMLElement)?.blur();
            }
        };

        document.body.addEventListener("click", focusBlurOnOuterClick);
        return () => {
            document.body.removeEventListener("click", focusBlurOnOuterClick);
        };
    }, []);

    const [hoveredScore, setHoveredScore] = useState<number | undefined>(undefined);

    return (
        data && user ?
            <div className={styles.userRate}>
                <Disclosure as={"div"} ref={popoverRef} className={styles.popover}>
                    <Disclosure.Button disabled={isMutatingRate || isFetching} className={styles.toggle} onClick={fixOnClickFocus}>
                        {
                            !isMutatingRate && !isFetching ?
                                data.user_rate ?
                                    <><span>{translatedStatus!}</span>{(data.user_rate.score || false) && <>
                                        <span>-</span><span className={styles.score}>{data.user_rate.score}</span></>}</>
                                    : <><span>Добавить в список</span><CgMathPlus /></>
                                :
                                <div className={styles.spinner}>
                                    <PiSpinnerGapLight />
                                </div>
                        }
                    </Disclosure.Button>
                    <Disclosure.Panel className={styles.panel}>
                        {({ close }) => (
                            <>
                                {
                                    !isMutatingRate && !isFetching ?
                                        <>
                                            {USER_RATE_STATUSES.map((s, i) => (
                                                translatedStatus === shikimoriUserRateTranslate(s as ShikimoriUserRateStatus)
                                                    ? null
                                                    : <button key={i}
                                                        children={shikimoriUserRateTranslate(s as ShikimoriUserRateStatus)}
                                                        onClick={() => {
                                                            close();
                                                            onStatusClick({
                                                                user_id: user.id,
                                                                target_id: data.id,
                                                                status: s as ShikimoriUserRateStatus
                                                            })();
                                                        }}
                                                    />
                                            ))}
                                            {data.user_rate &&
                                                <button className={styles.deleteBtn} children={"Удалить из списка"} onClick={async () => {
                                                    close();
                                                    await mutateRate({
                                                        type: "delete",
                                                        rateID: data.user_rate!.id
                                                    });
                                                    await queryClient.refetchQueries(['shikijoy', 'find', fullID]);
                                                }}
                                                />
                                            }
                                        </>
                                        :
                                        <div className={styles.spinner}>
                                            <PiSpinnerGapLight />
                                        </div>
                                }
                            </>
                        )}
                    </Disclosure.Panel>
                </Disclosure>
                <div className={styles.watchedEpsAndRewatches}>
                    <div className={styles.watchedEps}>
                        <div children={"Эпизодов"} />
                        <div children={`${data.user_rate?.episodes || 0} / ${data.episodes || '?'}`} />
                    </div>
                    {!!data.user_rate?.rewatches &&
                        <div className={styles.rewatches}
                            children={plural(data.user_rate.rewatches, '%d перепросмотр', '%d перепросмотра', '%d перепросмотров')}
                        />
                    }
                </div>
                {data.user_rate &&
                    <div className={styles.scoreStars}
                        style={{ "--score": (hoveredScore ?? data.user_rate?.score!) || 0 } as CSSProperties}
                        onMouseLeave={() => {
                            setHoveredScore(undefined);
                        }}
                    >
                        <Stars className={styles.starsFront} score={hoveredScore !== undefined ? hoveredScore + 1 : data.user_rate?.score ?? undefined} />
                        {hoveredScore !== undefined && <Stars className={styles.starsGhost} score={data.user_rate?.score ?? undefined} />}
                        <Stars className={styles.starsBack} />
                        <div className={styles.starHoverBoxes}>
                            {
                                USER_RATE_SCORES.map((e, i) => (
                                    <div key={i} className={styles.box} style={{ "--index": i } as CSSProperties} onMouseEnter={() => {
                                        !isMutatingRate && !isFetching && setHoveredScore(i);
                                    }}
                                        onClick={onStatusClick({
                                            user_id: user.id,
                                            target_id: data.id,
                                            score: i + 1
                                        })}
                                    />
                                ))
                            }
                        </div>
                    </div>
                }
                {data.user_rate?.status &&
                    <div className={styles.scoreDescription}>
                        {hoveredScore !== undefined || !!data.user_rate?.score ?
                            <>
                                <span>{(hoveredScore! + 1) || data.user_rate?.score}</span>
                                <span>-</span>
                                <span>{USER_RATE_SCORES[hoveredScore ?? (data.user_rate!.score! - 1)]}</span>
                            </>
                            :
                            <span>Нет оценки</span>
                        }
                    </div>
                }
            </div>
            : null
    );
};

export default AnimeUserRate;

function fixOnClickFocus() {
    requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    });
}

type StarsProps = {
    score?: number;
    className?: string;
};

function Stars({ className, score }: StarsProps) {
    return (
        <div className={className}>
            {
                [...new Array(5)].map((_, i) => (
                    <TbStarFilled key={i}
                        className={clsx(styles.star, score && score / 2 - i >= 1 && styles.full, score && score / 2 - i === 0.5 && styles.half)}
                    />
                ))
            }
        </div>
    );
}