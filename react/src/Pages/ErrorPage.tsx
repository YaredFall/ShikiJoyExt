import { FC } from 'react';
import { useRouteError } from "react-router-dom";
import MainContainer from "../Components/MainContainer";
import NotFound from "./NotFound";

type RouteError = {"status": number,"statusText": string,"internal":boolean,"data": any}

const ErrorPage:FC = () => {
    
    const error = useRouteError() as RouteError;
    
    if (error.status === 404) {
        return <NotFound />
    }
    
    return (
        <MainContainer>
            <h1>Необработанная ошибка!</h1>
        </MainContainer>
    );
};

export default ErrorPage;