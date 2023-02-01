import { FC } from 'react';
import { useQuery } from "react-query";
import { ShikimoriAnimeCoreData } from "../../types";
import AnimeDescription from "./AnimeDescription";
import { useParams } from "react-router-dom";
import { useAnimeJoyAnimePageQuery } from "../../Api/useAnimeJoyAnimePageQuery";
import { getTitles } from "../../Utils/scraping";

type AnimeAsideProps = {}

const AnimeAside: FC<AnimeAsideProps> = () => {

    const { id: fullID } = useParams();
    const id = fullID!.split('-')[0];

    const { data: pageDocument } = useAnimeJoyAnimePageQuery(fullID!);

    const {
        isLoading,
        isFetching,
        error,
        data
    } = useQuery<ShikimoriAnimeCoreData>(
        ['shikimori', 'search', fullID],
        () => fetch(`https://shikimori.one/api/animes?search=${getTitles(pageDocument).romanji}`)
            .then(fres => fres.json()
                              .then(sres =>
                                  fetch(`https://shikimori.one/api/animes/${sres[0].id}`)
                                      .then(animeRes => animeRes.json())
                              )
            ),
        {
            enabled: !!pageDocument,
            staleTime: 60 * 1000 * 60 * 12,
            cacheTime: 60 * 1000 * 60 * 12
        }
    );

    // if (!pageDocument || isLoading || isFetching) {
    //     return null;
    // }

    if (error) {
        return (
            <section>
                <h3>Произошла ошибка! Возможно ваш блокировщик рекламы блокирует запросы shikimori.one</h3>
            </section>
        );
    }

    return (
        <section>
            <AnimeDescription data={data} />
        </section>
    );
};

export default AnimeAside;