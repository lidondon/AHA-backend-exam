import { combineReducers } from 'redux';

import baseViewReducers from '../views/base_view_redux';
import loginReducers from '../views/login_redux';
import signUpReducers from '../views/sign_up_redux';
import userProfileReducers from '../views/user_profile_redux';
import resetPasswordReducers from '../views/reset_password_redux';
import userStatisticsReducers from '../views/user_statistics_redux';

const reducers = {
    baseView: baseViewReducers,
    login: loginReducers,
    signUp: signUpReducers,
    userProfile: userProfileReducers,
    resetPassword: resetPasswordReducers,
    userStatistics: userStatisticsReducers
}

export default combineReducers(reducers);