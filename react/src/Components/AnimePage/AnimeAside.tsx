import { FC, Fragment } from 'react';
import { useQuery } from "react-query";
import { AnimeJoyData, ShikimoriAnimeCoreData } from "../../types";
import AnimeDescription from "./AnimeDescription";

type AnimeAsideProps = {
    animeData: AnimeJoyData
}

const AnimeAside: FC<AnimeAsideProps> = ({ animeData }) => {

    if (!animeData) {
        return null;
    }

    const { isLoading, error, data } = useQuery<ShikimoriAnimeCoreData>(
        'test',
        () => fetch(`https://shikimori.one/api/animes?search=${animeData.title.romanji}`)
            .then(fres => fres.json()
                              .then(sres =>
                                  fetch(`https://shikimori.one/api/animes/${sres[0].id}`)
                                      .then(animeRes => animeRes.json())
                              )
            ),
        { retry: false }
    )

    return (
        <section>
            <>
                {error && <h2>Произошла ошибка! Возможно ваш блокировщик рекламы блокирует запросы shikimori.one</h2>}
                {!isLoading && !error && data &&
                    <AnimeDescription data={data} />
                }
            </>
        </section>
    );
};

export default AnimeAside;