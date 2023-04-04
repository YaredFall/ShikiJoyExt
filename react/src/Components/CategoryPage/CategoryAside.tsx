import { FC } from 'react';
import Searchbar from "../AnimePage/Searchbar";

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