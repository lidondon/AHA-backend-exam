import { getLoginData, setLoginData } from '../utilities/authentication';

const UPDATE_USER = 'UPDATE_USER';
const UPDATE_USER_URL = id => `/api/user/${id}`;
const GET_USER_INFO = 'GET_USER_INFO';
const GET_USER_INFO_URL = id => `/api/user/${id}`;
const SEND_EMAIL = 'SEND_EMAIL';
const SEND_EMAIL_URL = 'api/user/sendEmail';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const CLEAR_USER_PROFILE = 'CLEAR_USER_PROFILE';

const initialState = {
    isLoading: false,
    id: 0,
    email: '',
    name: '',
    hasVerified: -1,
    isSendEmailSuccessfully: false
}


export const clear = () => {
    return {
        type: CLEAR_USER_PROFILE
    };
}

export const getUserInfo = () => {
    const loginData = getLoginData();

    return {
        type: GET_USER_INFO,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_USER_INFO_URL(loginData.id),
        loginData
    };
};

export const updateUserName = (id, name) => {
    return {
        type: UPDATE_USER,
        method: "put",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: UPDATE_USER_URL(id),
        params: {
            name
        }
    };
};

export const sendEmail = () => {
    const loginData = getLoginData();

    return {
        type: SEND_EMAIL,
        method: "post",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: SEND_EMAIL_URL,
        params: {
            id: loginData.id,
            email: loginData.email
        }
    };
};

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_USER_PROFILE: processClear,
        GET_USER_INFO: processGetUserInfo,
        UPDATE_USER: processUpdateUserName,
        SEND_EMAIL: processSendEmail
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processClear = (state, action) => {
    return {
        isLoading: false,
        id: 0,
        email: '',
        name: '',
        hasVerified: -1,
        isSendEmailSuccessfully: false
    };
}

const processGetUserInfo = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        setLoginData(action.loginData.token, action.payload.data.id, action.payload.data.email, action.payload.data.name, action.payload.data.hasVerified);
        result.id = action.payload.data.id,
        result.email = action.payload.data.email,
        result.name = action.payload.data.name,
        result.hasVerified = action.payload.data.hasVerified
    }

    return result;
};

const processUpdateUserName = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) {
        result.name = action.params.name
    } 
    
    return result;
}

const processSendEmail = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) result.isSendEmailSuccessfully = true;

    return result;
}

const getBaseAxiosResult = (state, action) => {
    return {
        ...state,
        isLoading: action.isLoading,
        error: action.error
    };
};

export default reducer;