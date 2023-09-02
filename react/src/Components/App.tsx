import { FC } from "react";
import { createBrowserRouter, createRoutesFromElements, Outlet, redirect, Route, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import AnimePage from './AnimePage/AnimePage';
import "../index.scss";
import SideNav from "./SideNav/SideNav";
import { appRoutes, Categories } from "../Utils/appRoutes";
import AuthCallbackPage from "../Pages/AuthCallbackPage";
import { useGlobalLoadingStore } from "../Store/globalLoadingStore";
import LoadingPage from "../Pages/LoadingPage";
import CategoryPage from "./CategoryPage/CategoryPage";
import NotFound from "../Pages/NotFound";
import ErrorPage from "../Pages/ErrorPage";
import { useBlurOnEscapeKey } from "../Hooks/useBlurOnEscapeKey";
import SearchPage from "./SearchPage/SearchPage";

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

const shouldEndWithSlash = (props: any) => {
    if (!props.request.url.endsWith("/")) {
        const path = props.request.url.replace(location.origin, "");
        return redirect(path + "/");
    }
    return null;
};

const shouldHaveNaturalNumberID = (props: any) => {
    const id: string | undefined = props?.params?.id;
    if (id && id.match(/^(?:[1-9]\d?|[1-3]\d{2})$/)) {
        return null;
    } else {
        console.error("Not Found. Wrong ID");
        throw new Response("Not Found", { status: 404 });
    }
};

const shouldEndWithSlashAndHaveNaturalID = (props: any) => {
    const l1 = shouldEndWithSlash(props);
    const l2 = shouldHaveNaturalNumberID(props);
    return l1 ?? l2;
};

const router = createBrowserRouter(createRoutesFromElements(
    <>
        <Route path={appRoutes.authCallback} element={<AuthCallbackPage />} />
        <Route path={"/"} element={<><SideNav /><Outlet /></>}>
            <Route index element={<CategoryPage />} errorElement={<ErrorPage />} />
            <Route path="search/" element={<SearchPage />} errorElement={<ErrorPage />} />
            <Route path={"page/:id/"} loader={shouldEndWithSlashAndHaveNaturalID} errorElement={<ErrorPage />} element={<CategoryPage />} />
            {[...Categories.values()].filter(c => c !== "").map(c =>
                <Route key={c} path={c + '/'} errorElement={<ErrorPage />}>
                    <Route index loader={shouldEndWithSlash} element={<CategoryPage />} />
                    <Route path={":id"} element={<AnimePage />} />
                    <Route path={"page/:id/"} loader={shouldEndWithSlashAndHaveNaturalID} element={<CategoryPage />} />
                </Route>
            )}
            <Route path={appRoutes.any} element={<NotFound />} />
        </Route>
    </>
));

const App: FC = () => {
    const isLoading = useGlobalLoadingStore((state) => state.count) > 0;

    useBlurOnEscapeKey();

    return (
        <QueryClientProvider client={queryClient}>
            {isLoading && <LoadingPage />}
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
};

export default App;
