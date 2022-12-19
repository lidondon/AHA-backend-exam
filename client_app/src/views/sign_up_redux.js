import { getLoginData } from '../utilities/authentication';

const SIGN_UP = 'SIGN_UP';
const SIGN_UP_URL = 'api/user';

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

const reducer = (state = initialState, action) => {
    let resultCase = {
        SIGN_UP: processSignUp
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processSignUp = (state, action) => {
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