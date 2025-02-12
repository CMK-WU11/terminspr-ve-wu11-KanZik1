export const checkAuth = async () => {
    const token = getCookie('usertoken');

    if (!token) return null;

    try {
        const res = await fetch('http://localhost:4000/api/v1/auth/validate', {
            headers: {
                'Authorization': `Bearer ${token}`
            }

        });

        if (!res.ok) {
            deleteCookie('userToken');
            return null;

        }

        return token;
    } catch (error) {
        deleteCookie('userToken');
        return null;
    }

};

export const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

export const deleteCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
};

export const setCookie = (name: string, value: string, remember: boolean = false) => {
    if (remember) {
        document.cookie = `${name}=${value}; max-age=2592000; path=/`;

    } else {
        document.cookie = `${name}=${value}; path=/`;
    }
}