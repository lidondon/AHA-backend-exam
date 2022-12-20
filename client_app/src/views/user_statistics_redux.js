
const GET_USERS = 'GET_USERS';
const GET_USERS_URL = 'api/statistics/getusers';
const GET_USER_STATISTICS = 'GET_USER_STATISTICS';
const GET_USER_STATISTICS_URL = 'api/statistics/getuserstatistics';

const LOADING = 'LOADING';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

const initialState = {
    isLoading: false,
    usersCount: 0,
    todayActiveUserCount: 0,
    average7daysUserCount: 0,
    users: []
}

export const getUsers = () => {
    return {
        type: GET_USERS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_USERS_URL
    };
};

export const getUserStatistics = () => {
    console.log('processGetUserStatistics');
    return {
        type: GET_USER_STATISTICS,
        statuses: [ LOADING, SUCCESS, ERROR ],
        url: GET_USER_STATISTICS_URL
    };
};

const reducer = (state = initialState, action) => {
    let resultCase = {
        GET_USERS: processGetUsers,
        GET_USER_STATISTICS: processGetUserStatistics        
    };

    return resultCase[action.type] ? resultCase[action.type](state, action) : state;
};

const processGetUsers = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) result.users = action.payload.data

    return result;
}

const processGetUserStatistics = (state, action) => {
    const result = getBaseAxiosResult(state, action);
    
    if (action.status === SUCCESS && action.payload) { 
        result.usersCount = action.payload.data.usersCount;
        result.todayActiveUserCount = action.payload.data.todayActiveUserCount;
        result.average7daysUserCount = action.payload.data.average7daysUserCount;
    }

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