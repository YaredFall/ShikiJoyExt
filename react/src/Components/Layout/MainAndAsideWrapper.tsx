import { FC, ReactNode } from 'react';
import MainContainer from "./MainContainer";
import AsideContainer from "./AsideContainer";

type MainAndAsideWrapperProps = {
    main?: ReactNode,
    aside?: ReactNode
}

const MainAndAsideWrapper: FC<MainAndAsideWrapperProps> = ({ main, aside }) => {
    return (
        <>
            {main &&
                <MainContainer>
                    {main}
                </MainContainer>
            }
            {aside &&
                <AsideContainer>
                    {aside}
                </AsideContainer>
            }
        </>
    );
};

export default MainAndAsideWrapper;