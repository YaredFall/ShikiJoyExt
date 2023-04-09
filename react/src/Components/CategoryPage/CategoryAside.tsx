import { FC } from 'react';
import Searchbar from "../Common/Searchbar";

type HomeAsideProps = {
    
}

const CategoryAside:FC<HomeAsideProps> = () => {
    return (
        <div>
            <Searchbar />
        </div>
    );
};

export default CategoryAside;