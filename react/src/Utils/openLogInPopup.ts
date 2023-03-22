export const openLogInPopup = async (onOpen?: () => void, onClose?: () => void) => {
    const w = 500; const h = 600;
    const x = window.top!.outerWidth / 2 + window.top!.screenX - ( w / 2);
    const y = window.top!.outerHeight / 2 + window.top!.screenY - ( h / 2);
    const windowFeatures =`popup,width=${w},height=${h},left=${x},top=${y}`;

    const loginPopup = window.open("https://shikimori.one/oauth/authorize?client_id=gtnySBXeUe_5GAo8r18tRMTluXc490hDHKdQT7wV6ak&redirect_uri=https%3A%2F%2Fanimejoy.ru%2Fshikijoy%2Fauth-callback&response_type=code&scope=user_rates", "login-popup", windowFeatures);
    onOpen && onOpen();
    
    if (loginPopup) {
        let timer = setInterval(async () => {
            if (loginPopup.closed) {
                onClose && onClose();
                if (timer) clearInterval(timer);
            }
        }, 500);
    }
}