import { FC } from "react";
import { createBrowserRouter, createRoutesFromElements, Outlet, redirect, Route, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import AnimePage from './AnimePage/AnimePage';
import "../index.scss";
import SideNav from "./SideNav";
import { appRoutes, Categories } from "../Utils/appRoutes";
import AuthCallbackPage from "../Pages/AuthCallbackPage";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";
import LoadingPage from "../Pages/LoadingPage";
import CategoryPage from "./HomePage/CategoryPage";

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

const shouldEndWithSlashLoader = (props: any) => {
    if (!props.request.url.endsWith("/")) {
        const path = props.request.url.replace(location.origin, "");
        return redirect(path + "/");
    }
    return null;
};

const router = createBrowserRouter(createRoutesFromElements(
    <>
        <Route path={appRoutes.authCallback} element={<AuthCallbackPage />} />
        <Route path={"/"} element={<><SideNav /><Outlet /></>}>
            <Route index element={<CategoryPage />} />
            <Route path={"page/:id/"} loader={shouldEndWithSlashLoader} element={<CategoryPage />} />
            {[...Categories.values()].filter(c => c !== "").map(c =>
                <Route key={c} path={c + '/'}>
                    <Route index loader={shouldEndWithSlashLoader} element={<CategoryPage />} />
                    <Route path={":id"} element={<AnimePage />} />
                    <Route path={"page/:id/"} loader={shouldEndWithSlashLoader} element={<CategoryPage />} />
                </Route>
            )}
            <Route path={appRoutes.any} element={<div>Not found</div>} />
        </Route>
    </>
));

const App: FC = () => {
    const isLoading = useGlobalLoadingStore((state) => state.count) > 0;

    return (
        <QueryClientProvider client={queryClient}>
            {isLoading && <LoadingPage />}
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
