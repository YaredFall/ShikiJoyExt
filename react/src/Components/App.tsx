import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import AnimePage from './AnimePage/AnimePage';
import { AnimeJoyData } from "../types";
import "../index.scss"
import { useAnimeDataStore } from "../Store/animeDataStore";
import SideNav from "./SideNav";
import { appRoutes } from "../Utils/appRoutes";
import MainContainer from "./MainContainer";
import AsideContainer from "./AsideContainer";
import AnimeAside from "./AnimePage/AnimeAside";

const queryClient = new QueryClient()


const App: FC<{ data: AnimeJoyData }> = ({ data }) => {

    const setAnimeData = useAnimeDataStore(state => state.set);
    setAnimeData(data);

    return (
        <QueryClientProvider client={queryClient}>
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
                <AsideContainer>
                    <Routes>
                        <Route path={appRoutes.serials}>
                            <Route index element={"Сериалы aside"}/>
                            <Route path={appRoutes.idParam} element={<AnimeAside animeData={data}/>}/>
                        </Route>
                        <Route path={appRoutes.any} element={<div>Aside</div>}/>
                    </Routes>
                </AsideContainer>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
