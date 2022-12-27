
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

export default {
    refreshToken,
    post,
    put,
    googleLogin,
    facebookLogin
};

