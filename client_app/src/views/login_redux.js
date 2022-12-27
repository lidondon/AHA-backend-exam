import { setLoginData } from '../utilities/authentication';
import { assembleErrorMsg } from '../utilities/util';

const AUTH_BASE_URL = `https://${SERVER_HOST}`;
const LOGIN = "LOGIN";
const LOGIN_URL = "/api/login";
const GOOGLE_LOGIN = "GOOGLE_LOGIN";
const GOOGLE_LOGIN_URL = "/api/login/google";
const FACEBOOK_LOGIN = "FACEBOOK_LOGIN";
const FACEBOOK_LOGIN_URL = "/api/login/facebook";

const LOADING = "LOADING";
const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

const initialState = {
    isLoading: false,
    error: ""
};

export const login = (email, password) => {
    return {
        type: LOGIN,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        baseUrl: AUTH_BASE_URL,
        url: LOGIN_URL,
        params: {
            email,
            password
        }
    };
};

export const googleLogin = (email, name) => {
    return {
        type: GOOGLE_LOGIN,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        baseUrl: AUTH_BASE_URL,
        url: GOOGLE_LOGIN_URL,
        params: {
            email,
            name
        }
    };
};

export const facebookLogin = (email, name) => {
    return {
        type: FACEBOOK_LOGIN,
        statuses: [ LOADING, SUCCESS, ERROR ],
        method: "post",
        baseUrl: AUTH_BASE_URL,
        url: FACEBOOK_LOGIN_URL,
        params: {
            email,
            name
        }
    };
};

const reducer = (state = initialState, action) => {
    let resultCase = {
        LOGIN: processLogin,
        GOOGLE_LOGIN: processLogin,
        FACEBOOK_LOGIN: processLogin
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processLogin = (state, action) => {
    let error = assembleErrorMsg(LOGIN, action.error);
    if (action.status === SUCCESS && action.payload) {
        setLoginData(action.payload.data.token, action.payload.data.id, action.payload.data.email, action.payload.data.name, action.payload.data.hasVerified);
    }

    return {
        ...state,
        isLoading: action.isLoading,
        error: error
    };
};

export default reducer;