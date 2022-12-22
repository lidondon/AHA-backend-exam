import userModule from '../modules/user_module';
import stringZh from '../../config/string_zh';
import utility from '../utility';

const get = (request, response) => {
    userModule.getUser(request.params.id).then((result) => {
        if (result.length === 1) {
            const user = {
                id: result[0].id,
                email: result[0].email,
                name: result[0].name,
                hasVerified: result[0].has_verified,
                createdTime: result[0].created_time
            };

            response.send(utility.http.successResponse(user));
        } else {
            response.status(204).send(stringZh.noUser);
        }
    }).catch((error) => {
        response.send(utility.http.errorResponse(500, `${stringZh.getUserFailure}: ${error}`));
        response.status(500).send(`${stringZh.getUserFailure}: ${error}`);
    });
};

const post = (request, response) => {
    userModule.createUser(request.body).then((result) => {
        response.send(utility.http.successResponse({ id: result }));
    }).catch((error) => {
        response.status(500).send(`${stringZh.insertFailure}: ${error}`);
    });
};

const put = (request, response) => {
    userModule.updateUser(request.body, request.params.id).then((result) => {
        response.send(utility.http.successResponse(result.affectedRows === 1));
    }).catch((error) => {
        response.status(500).send(`${stringZh.updateUserFailure}: ${error}`);
    });
};

const sendVerifyingEmail = (request, response) => {
    const url = `https://${request.headers.host}/api/user/verify`;

    userModule.sendVerifyingEmail(url, request.body).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(error);
    });
};

const verifyEmail = (request, response) => {
    userModule.verifyEmail(request.params.id, request.params.emailhash).then(() => {
        response.redirect('/');
    }).catch((error) => {
        response.status(500).send(error);
    });
};

export default {
    get,
    post,
    put,
    sendVerifyingEmail,
    verifyEmail
};

