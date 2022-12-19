import { getLoginData } from '../utilities/authentication';

const RESET_PASSWORD = 'RESET_PASSWORD';
const RESET_PASSWORD_URL = id => `/api/login/${id}`;

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';
const CLEAR_RESET_PASSWORD = 'CLEAR_RESET_PASSWORD';

const initialState = {
    isLoading: false,
    isSuccess: false
}

export const clear = () => {
    return {
        type: CLEAR_RESET_PASSWORD
    };
}

export const resetPassword = (password, newPassword) => {
    return {
        type: RESET_PASSWORD,
        method: "put",
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: RESET_PASSWORD_URL(getLoginData().id),
        params: {
            password,
            newPassword
        }
    };
};

const reducer = (state = initialState, action) => {
    let resultCase = {
        CLEAR_RESET_PASSWORD: processClear,
        RESET_PASSWORD: processResetPassword
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processClear = (state, action) => {
    return {
        isLoading: false,
        isSuccess: false
    };
}

const processResetPassword = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    result.isSuccess = action.status === SUCCESS;

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
