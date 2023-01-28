import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AnimePage from './AnimePage';
import { AnimeData } from "../types";
import "../index.scss"
import { useAnimeDataStore } from "../Store/animeDataStore";
import SideNav from "./SideNav";
import { appRoutes } from "../Utils/appRoutes";
import MainContainer from "./MainContainer";

const App: FC<{ data: AnimeData }> = ({ data }) => {

    const setAnimeData = useAnimeDataStore(state => state.set);
    setAnimeData(data);

    return (
        <BrowserRouter>
            <SideNav/>
            <MainContainer>
                <Routes>
                    <Route path={appRoutes.serials}>
                        <Route index element={"Сериалы"}/>
                        <Route path={appRoutes.idParam} element={<AnimePage/>}/>
                    </Route>
                    <Route path={appRoutes.home} element={<div>Home Page</div>}/>
                    <Route path={appRoutes.any} element={<div>Not found</div>}/>
                </Routes>
            </MainContainer>
            <aside>
                Aside
            </aside>
        </BrowserRouter>
    )
}

export default App
