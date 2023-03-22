import { FC, ReactNode } from 'react';
import MainContainer from "./MainContainer";
import AsideContainer from "./AsideContainer";
import AnimeAside from "./AnimePage/AnimeAside";

type MainAndAsideWrapperProps = {
    children?: ReactNode
}

const MainAndAsideWrapper:FC<MainAndAsideWrapperProps> = ({children}) => {
    return (
        <>
            <MainContainer>
                {children}
            </MainContainer>
            <AsideContainer>
                <AnimeAside />
            </AsideContainer>
        </>
    );
};

export default MainAndAsideWrapper;