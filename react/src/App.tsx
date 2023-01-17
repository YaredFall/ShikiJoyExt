import {FC} from "react";
import {BrowserRouter, Link, Route, Routes} from "react-router-dom";
import AnimePage from './Components/AnimePage';
import {AnimeData} from "./types";
import "./index.scss"
import {useAnimeDataStore} from "./Store/animeDataStore";

const App: FC<{data: AnimeData}> = ({data}) => {

    const setAnimeData = useAnimeDataStore(state => state.set);
    setAnimeData(data);

    return (
        <BrowserRouter>
            <Link to={"/"} children={<div>Home link</div>} />
            <Link to={"/tv-serialy/2880-ukrotitel-zverey-izgnannyy-iz-komandy-geroya-vstretil-devochku-koshku-iz-silneyshey-rasy.html"}
                  children={<div>Test link</div>} />
            <Link to={"/2880-ukrotitel-zverey-izgnannyy-iz-komandy-geroya-vstretil-devochku-koshku-iz-silneyshey-rasy.html"}
                  children={<div>Test link 2</div>} />

            <Routes>
                <Route path={"/tv-serialy"} >
                    <Route index element={"Сериалы"} />
                    <Route path={":id"} element={<AnimePage/>} />
                </Route>
                <Route path={"/"} element={<div>Home Page</div>} />
                <Route path={"*"} element={<div>Not found</div>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
