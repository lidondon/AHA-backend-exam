import sgMail from '@sendgrid/mail';
import utility from '..//utility';
import config from '../../config/config';
import stringZh from '../../config/string_zh';

const getUser = (id) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where id = ? ';

                connection.query(sqlString, id, (error, result) => {
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

const createUser = (newUser) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'insert into users set ? ';
                const insertData = {
                    ...newUser,
                    password: utility.jwt.getHash(newUser.password)
                };

                connection.query(sqlString, insertData, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else {
                        resolve(result.insertId);
                    }
                });
            }
            connection.release();
        });
    });
};

const updateUser = (newData, id) => {
    return new Promise((resolve, reject) => {
        utility.sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'update users set ? where id = ?';
                const parameters = [newData, id];

                connection.query(sqlString, parameters, (error, result) => {
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

const sendVerifyingEmail = (url, user) => {
    return new Promise((resolve, reject) => {
        const message = {
            to: user.email,
            from: config.emailFrom,
            subject: stringZh.verifyingEmailSubject,
            html: `<b>${stringZh.clickUrlBelow2Verify}</b><br />${url}/${user.id}/hash/${utility.jwt.getHash(user.email)}`
        };

        sgMail.setApiKey(config.sendgridApiKey);
        sgMail.send(message, (error, json) => {
            if (error) {
                reject(error);
            } else {
                resolve(json);
            }
        });
    });
};

const verifyEmail = (id, emailhash) => {
    return new Promise((resolve, reject) => {
        getUser(id).then((users) => {
            if (users.length === 1 && emailhash === utility.jwt.getHash(users[0].email)) {
                updateUser({ has_verified: 1 }, id).then((result) => {
                    resolve(result);
                }).catch((updateError) => {
                    reject(updateError);
                });
            } else {
                reject(stringZh.verifyingEmailLinkError);
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export default {
    getUser,
    createUser,
    updateUser,
    sendVerifyingEmail,
    verifyEmail
};
