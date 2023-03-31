import { FC } from 'react';
import MainContainer from "../Components/MainContainer";

type NotFoundProps = {
    
}

const NotFound:FC<NotFoundProps> = () => {
    return (
        <MainContainer>
            <h1>404</h1>
            <p>Страница не найдена</p>
        </MainContainer>
    );
};

export default NotFound;