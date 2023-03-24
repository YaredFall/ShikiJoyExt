import { FC } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import AnimePage from './AnimePage/AnimePage';
import "../index.scss";
import SideNav from "./SideNav";
import { appRoutes } from "../Utils/appRoutes";
import AuthCallbackPage from "../Pages/AuthCallbackPage";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";
import LoadingPage from "../Pages/LoadingPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
            retry: (failureCount, error) => {
                // @ts-ignore
                return (error.message === `SyntaxError: Unexpected token 'R', "Retry later" is not valid JSON` || error.message === "Unexpected token 'R', \"Retry later\n\" is not valid JSON");
            }
        },
    },
});

const App: FC = () => {
    const isLoading = useGlobalLoadingStore((state) => state.count) > 0;

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {isLoading && <LoadingPage />}
                <Routes>
                    <Route path={appRoutes.authCallback} element={<AuthCallbackPage />} />
                    <Route path={"/"} element={<><SideNav /><Outlet /></>}>
                        <Route path={appRoutes.serials}>
                            <Route index element={"Сериалы"} />
                            <Route path={appRoutes.idParam} element={<AnimePage />} />
                        </Route>
                        <Route path={appRoutes.films}>
                            <Route index element={"Аниме фильмы"} />
                            <Route path={appRoutes.idParam} element={<AnimePage />} />
                        </Route>
                        <Route path={appRoutes.ova}>
                            <Route index element={"OVA/ONA/OAV"} />
                            <Route path={appRoutes.idParam} element={<AnimePage />} />
                        </Route>
                        {/* Needs separate page! */}
                        {/*<Route path={appRoutes.dorams}>*/}
                        {/*    <Route index element={"Дорамы"} />*/}
                        {/*    <Route path={appRoutes.idParam} element={<AnimePage />} />*/}
                        {/*</Route>*/}
                        <Route path={appRoutes.home} element={<div>Home Page</div>} />

                        <Route path={appRoutes.any} element={<div>Not found</div>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
};

export default App;
