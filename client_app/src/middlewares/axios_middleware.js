import axios from 'axios';
import { isLogin, setLoginData, getLoginData } from '../utilities/authentication';

import { SERVER_ERROR } from '../views/base_view_redux';

const BASE_URL = `https://${SERVER_HOST}`;
const AUTH_BASE_URL = `https://${SERVER_HOST}`;
const AUTH_HEARDER = 'Authorization';
const BEARER_PREFIX = 'Bearer ';

const axiosMiddelware = store => next => action => {
    if (!action.url || !Array.isArray(action.statuses)) return next(action);
    const [ LOADING, SUCCESS, ERROR ] = action.statuses;
    const axiosConfig = {
        baseURL: (action.baseUrl) ? action.baseUrl : BASE_URL,
        method: (action.method) ? action.method : 'get',
        url: action.url,
        headers: { 
            'Content-Type': 'application/json',
            ...action.headers
        },
        data: action.params
    }
    
    addAuthInfoInHeader(axiosConfig.headers);
    next({
        type: action.type,
        status: LOADING,
        isLoading: true,
        ...action,
    });
    axios(axiosConfig).then(response => {
        next({
            type: action.type,
            status: SUCCESS,
            isLoading: false,
            payload: response.data,
            ...action
        });
    }).catch(error => {
        if (error.response && error.response.status === 401) {
            refreshAndRecall().then(() => {
                addAuthInfoInHeader(axiosConfig.headers);
                axios(axiosConfig).then(response => {
                    next({
                        type: action.type,
                        status: SUCCESS,
                        isLoading: false,
                        payload: response.data,
                        ...action
                    });
                }).catch(errorRecall => { 
                    next({
                        type: action.type,
                        status: ERROR,
                        isLoading: false
                    });
                    next({
                        type: SERVER_ERROR,
                        error: errorRecall
                    });
                });
            }).catch(errorRefresh => {
                next({
                    type: action.type,
                    status: ERROR,
                    isLoading: false
                });
                next({
                    type: SERVER_ERROR,
                    error: errorRefresh
                });
            });
        } else {
            next({
                type: action.type,
                isLoading: false
            });
            next({
                type: SERVER_ERROR,
                error
            });
        }
    });
}

const refreshAndRecall = () => {
    return new Promise((resolve, reject) => {
        const loginData = getLoginData();

        if (loginData.token && loginData.id, loginData.email) {
            const axiosConfig = {
                baseURL: AUTH_BASE_URL,
                method: 'post',
                url: '/api/login/refreshtoken',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `${BEARER_PREFIX}${loginData.token}`
                },
                data: {
                    id: loginData.id,
                    email: loginData.email
                }
            }

            axios(axiosConfig).then(response => {
                setLoginData(response.data.data.token, loginData.id, loginData.email, loginData.name, loginData.hasVerified);
                resolve();
            }).catch(error => { 
                if (error.response && error.response.data && error.response.data.errors 
                    && error.response.data.errors.length > 0 
                    && error.response.data.errors[0].indexOf('has been used') > 0) {
                        setTimeout(() => {
                            resolve();
                        }, 200);
                        console.log('duplicated refresh token and recall');
                } else {
                    reject(error);
                }
            });
        } else {
            reject();
        }
    });
}

const addAuthInfoInHeader = headers => {
    if (isLogin()) {
        headers[AUTH_HEARDER] = `${BEARER_PREFIX}${getLoginData().token}`;
    }
}

export default axiosMiddelware;
