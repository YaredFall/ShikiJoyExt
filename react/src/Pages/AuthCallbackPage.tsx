import { FC, useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import { useGetShikimoriTokens } from "../Api/useGetShikimoriTokens";
import { useGetShikimoriUser } from "../Api/useGetShikimoriUser";
import styles from "./AuthCallbackPage.module.scss"
import plural from "plural-ru";

type AuthCallbackPageProps = {
    
}

const AuthCallbackPage:FC<AuthCallbackPageProps> = () => {
    
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    
    const { data, isError } = useGetShikimoriTokens(code);
    const { data: user } = useGetShikimoriUser(!!data);
    
    return (
        <div>
            { isError ? "Произошла ошибка!" : (user ? <SuccessfulLogInPage user={user} /> : "Загрузка...")}
        </div>
    );
};

export default AuthCallbackPage;

type SuccessfulLogInPageProps = {
    user: any
}
const SuccessfulLogInPage:FC<SuccessfulLogInPageProps> = ({ user }) => {
    const [secondsBeforeClosing, setSecondsBeforeClosing] = useState(3);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (secondsBeforeClosing > 1) {
                setSecondsBeforeClosing(prev => prev - 1);
            } else {
                window.close();
            }
        }, 1000)
        return () => {
            clearTimeout(timeout);
        };
    }, [secondsBeforeClosing]);
    

    return (
        <div className={styles.container}>
            <div className={styles.user}>
                <img src={user?.avatar}/>
                <span>{user?.nickname}</span>
            </div>
            <h1>Авторизация успешна</h1>
            <p>Окно закроется через {plural(secondsBeforeClosing, '%d секунду', '%d секунды')}</p>
        </div>
    );
}