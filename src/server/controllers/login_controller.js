
import loginModule from '../modules/login_module';
import stringZh from '../../config/string_zh';
import utility from '../utility';

const refreshToken = (request, response) => {
    const input = request.body;

    loginModule.refreshToken(input).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(error);
    });
};

const post = (request, response) => {
    const input = request.body;

    loginModule.login(input).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(error);
    });
};

const put = (request, response) => {
    loginModule.resetPassword(request.body, request.params).then((result) => {
        response.send(utility.http.successResponse(result.affectedRows === 1));
    }).catch((error) => {
        response.status(500).send(`${stringZh.updateUserFailure}: ${error}`);
    });
};

const googleLogin = (request, response) => {
    loginModule.googleOrFacebookLogin(request.body.email, request.body.name, loginModule.SIGN_UP_TYPE.GOOGLE).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(`Google login error: ${error}`);
    });
};

const facebookLogin = (request, response) => {
    loginModule.googleOrFacebookLogin(request.body.email, request.body.name, loginModule.SIGN_UP_TYPE.FACEBOOK).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(`Facebook login error: ${error}`);
    });
};

const privacy = (request, response) => {
    response.send('隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。');
};

const deleteUser = (request, response) => {
    response.send('已刪除使用者資料。');
};

export default {
    refreshToken,
    post,
    put,
    googleLogin,
    facebookLogin,
    privacy,
    deleteUser
};

