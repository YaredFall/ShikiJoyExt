import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query'
import AnimePage from './AnimePage/AnimePage';
import "../index.scss"
import SideNav from "./SideNav";
import { appRoutes } from "../Utils/appRoutes";
import MainContainer from "./MainContainer";
import AsideContainer from "./AsideContainer";
import AnimeAside from "./AnimePage/AnimeAside";

const queryClient = new QueryClient()


const App: FC = () => {

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <SideNav />
                <MainContainer>
                    <Routes>
                        <Route path={appRoutes.serials}>
                            <Route index element={"Сериалы"} />
                            <Route path={appRoutes.idParam} element={<AnimePage />} />
                        </Route>
                        <Route path={appRoutes.home} element={<div>Home Page</div>} />
                        <Route path={appRoutes.any} element={<div>Not found</div>} />
                    </Routes>
                </MainContainer>
                <AsideContainer>
                    <Routes>
                        <Route path={appRoutes.serials}>
                            <Route index element={"Сериалы aside"} />
                            <Route path={appRoutes.idParam} element={<AnimeAside />} />
                        </Route>
                        <Route path={appRoutes.any} element={<div>Aside</div>} />
                    </Routes>
                </AsideContainer>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
