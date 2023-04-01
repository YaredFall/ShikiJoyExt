import { FC, ReactNode } from 'react';
import { Portal } from 'react-portal';


type PortalProps = {
    isOpen: boolean
    children: ReactNode
}

const PopupPortal:FC<PortalProps> = ({ isOpen, children }) => {
    return (
        <>
            {isOpen && <Portal children={children} node={document.querySelector("main")} />}
        </>
    );
};

export default PopupPortal;