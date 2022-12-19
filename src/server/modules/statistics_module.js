import stringZh from '../../config/string_zh';
import utility from '..//utility';

const getUsers = () => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = `select users.id, users.email, users.name, users.created_time, count(login_records.id) as login_times, actions.action_time, actions.action_url 
                from users
                left join login_records
                on users.id = login_records.user_id
                left join (select user_id, action_time, action_url, rn from (select *, row_number() over (partition by user_id order by id desc) as rn from user_actions) actions where rn = 1) actions
                on users.id = actions.user_id
                group by users.id`;

                connection.query(sqlString, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else {
                        resolve(result);
                    }
                });
            }
            connection.release();
        });
    });
};

const checkUsersStatistics = (data) => {
    let result = false;

    for (let i = 0; i < data.length; i++) {
        if (data[i].length === 0) {
            result = true;
            break;
        }
    }

    return result;
};

const getUserStatistics = () => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlUserCount = 'select count(id) as users_count from users';
                const sqlTodayUserCount = 'select count(*) as today_active_user_count from (select user_id from user_actions where user_actions.action_time > curdate() group by user_id) actions';
                const sql7daysAverageCountl = `select action_date, count(user_id) as active_user_count
                from 
                (select date(action_time) as action_date, user_actions.user_id, row_number() over (partition by date(action_time), user_id order by id desc) as rn
                from user_actions 
                where date(action_time) between date_sub(curdate(), interval 6 day)  and curdate()) actions
                where actions.rn = 1
                group by action_date`;
                const sqlString = `${sqlUserCount};${sqlTodayUserCount};${sql7daysAverageCountl};`;

                connection.query(sqlString, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else {
                        const isResultError = checkUsersStatistics(result);

                        if (isResultError) {
                            reject(stringZh.getDataFailure);
                        } else {
                            const sum = result[2].reduce((partialSum, data) => { return partialSum + data.active_user_count; }, 0);
                            const average7daysUserCount = (sum / 7).toFixed(1);

                            resolve({
                                usersCount: result[0][0].users_count,
                                todayActiveUserCount: result[1][0].today_active_user_count,
                                average7daysUserCount
                            });
                        }
                    }
                });
            }
            connection.release();
        });
    });
};

export default {
    getUsers,
    getUserStatistics
};
