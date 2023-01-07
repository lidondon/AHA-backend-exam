import { setLoginData } from '../utilities/authentication';
import { assembleErrorMsg } from '../utilities/util';

const AUTH_BASE_URL = `https://${SERVER_HOST}`;
const SIGN_UP = 'SIGN_UP';
const SIGN_UP_URL = 'api/user';
const GOOGLE_LOGIN = "GOOGLE_LOGIN";
const GOOGLE_LOGIN_URL = "/api/login/google";
const FACEBOOK_LOGIN = "FACEBOOK_LOGIN";
const FACEBOOK_LOGIN_URL = "/api/login/facebook";

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const initialState = {
    isLoading: false,
    isSuccess: false
}

export const signUp = (email, password) => {
    return {
        type: SIGN_UP,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: SIGN_UP_URL,
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
        SIGN_UP: processSignUp,
        GOOGLE_LOGIN: processLogin,
        FACEBOOK_LOGIN: processLogin
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processSignUp = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    result.isSuccess = action.status === SUCCESS;

    return result;
}

const processLogin = (state, action) => {
    let error = assembleErrorMsg(SIGN_UP, action.error);
    if (action.status === SUCCESS && action.payload) {
        setLoginData(action.payload.data.token, action.payload.data.id, action.payload.data.email, action.payload.data.name, action.payload.data.hasVerified);
    }

    return {
        ...state,
        isLoading: action.isLoading,
        error: error
    };
};

const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
};

export default reducer;