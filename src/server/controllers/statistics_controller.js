import statisticsModule from '../modules/statistics_module';
import stringZh from '../../config/string_zh';
import utility from '../utility';

const getUsers = (request, response) => {
    statisticsModule.getUsers(request.body).then((result) => {
        const data = result.map((r) => {
            return {
                id: r.id,
                email: r.email,
                name: r.name,
                createdTime: utility.common.toLocalTime(r.created_time),
                loginTimes: r.login_times,
                theLastActionTime: utility.common.toLocalTime(r.action_time),
                action: r.action_url
            };
        });

        response.send(utility.http.successResponse(data));
    }).catch((error) => {
        response.status(500).send(`${stringZh.getUsersFailure}: ${error}`);
    });
};

const getUserStatistics = (request, response) => {
    statisticsModule.getUserStatistics(request.body).then((result) => {
        response.send(utility.http.successResponse(result));
    }).catch((error) => {
        response.status(500).send(`${stringZh.getUsersFailure}: ${error}`);
    });
};

export default {
    getUsers,
    getUserStatistics
};

