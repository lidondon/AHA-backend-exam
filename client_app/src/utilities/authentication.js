const setCookie = (key, value) => {
    document.cookie = `${key}=${value}`;
};

const deleteCookie = (key) => {
    document.cookie = `${key}=; Max-Age=0`;
}

export const isLogin = () => {
    return getLoginData().token ? true : false;
};

export const setLoginData = (token, id, email, name, hasVerified) => {
    setCookie('token', token);
    setCookie('id', id);
    setCookie('email', email);
    setCookie('name', name);
    setCookie('hasVerified', hasVerified);
};

export const getLoginData = () => {
    const cookies = document.cookie.split(';');
    let result = {};

    if (cookies) {
        const token = cookies.find(c => c.trim().startsWith(`token=`));
        const id = cookies.find(c => c.trim().startsWith(`id=`));
        const email = cookies.find(c => c.trim().startsWith(`email=`));
        const name = cookies.find(c => c.trim().startsWith(`name=`));
        const hasVerified = cookies.find(c => c.trim().startsWith(`hasVerified=`));

        if (token) result.token = token.trim().substring('token='.length);
        if (id) result.id = id.trim().substring('id='.length);
        if (email) result.email = email.trim().substring('email='.length);
        if (name) result.name = name.trim().substring('name='.length);
        if (hasVerified !== undefined) result.hasVerified = hasVerified.trim().substring('hasVerified='.length);
    }
    
    return result;
};

export const logout = () => {
    deleteCookie('token');
    deleteCookie('id');
    deleteCookie('email');
    deleteCookie('name');
    deleteCookie('hasVerified');
};
