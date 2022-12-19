import utility from '..//utility';
import stringZh from '../../config/string_zh';

// for saving time, use this simple way not "access token and refresh token" and might have some safety issue
const refreshToken = (input) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where id = ? and email = ?';
                const sqlParameters = [input.id, input.email];

                connection.query(sqlString, sqlParameters, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(stringZh.refreshTokenFailure);
                    } else {
                        resolve({ token: utility.jwt.createToken(result[0].id, result[0].email) });
                    }
                    connection.release();
                });
            }
        });
    });
};

const insertLoginRecord = (id, connection, callback) => {
    const sqlString = 'insert into login_records set ? ';
    const insertData = { user_id: id };

    connection.query(sqlString, insertData, callback);
};

const login = (loginData) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where email = ? and password = ?';
                const sqlParameters = [loginData.email, utility.jwt.getHash(loginData.password)];

                connection.query(sqlString, sqlParameters, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(stringZh.loginError);
                    } else {
                        const data = {
                            id: result[0].id,
                            email: result[0].email,
                            name: result[0].name,
                            hasVerified: result[0].has_verified,
                            token: utility.jwt.createToken(result[0].id, result[0].email)
                        };

                        insertLoginRecord(result[0].id, connection, (err) => {
                            if (err) {
                                reject(stringZh.loginRecordFailure);
                            } else {
                                resolve(data);
                            }
                        });
                    }
                    connection.release();
                });
            }
        });
    });
};

const verifyPassword = (id, password, connection, callback) => {
    const sqlString = 'select * from users where id = ? and password = ?';
    const sqlParameters = [id, utility.jwt.getHash(password)];

    connection.query(sqlString, sqlParameters, callback);
};

const resetPassword = (input, params) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                verifyPassword(params.id, input.password, connection, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(stringZh.passwordError);
                    } else {
                        const sqlString = 'update users set password = ? where id = ?';
                        const newPasswordHash = utility.jwt.getHash(input.newPassword);
                        const sqlParameters = [newPasswordHash, params.id];

                        connection.query(sqlString, sqlParameters, (err, resetResult) => {
                            if (error) {
                                reject(err.sqlMessage);
                            } else {
                                resolve(resetResult);
                            }
                        });
                    }
                });
            }
            connection.release();
        });
    });
};

export default {
    refreshToken,
    login,
    resetPassword
};
