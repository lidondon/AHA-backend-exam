import jwtWebToken from 'jsonwebtoken';
import sha1 from 'js-sha1';
import httpStatus from 'http-status';
import mysql from 'mysql';
import config from '../config/config';
import stringZh from '../config/string_zh';

const SIGN_UP_BY_EMAIL = 1;

// sql utility

const connectionPool = mysql.createPool({
    connectionLimit: 20,
    host: config.mysqlHost,
    user: config.mysqlUserName,
    password: config.mysqlPass,
    database: config.mysqlDatabase,
    timezone: 'UTC',
    multipleStatements: true
});

const sql = {
    connectionPool
};

// http utility

const successResponse = (data) => {
    return {
        statusCode: httpStatus[200],
        data
    };
};

const getValidationMiddleware = (schema, message) => {
    return (request, response, next) => {
        if (schema.validate(request.body).error) {
            response.status(400).send(message);
        } else {
            next();
        }
    };
};

const http = {
    successResponse,
    getValidationMiddleware
};

// jwt utility

const getHash = (input) => {
    return sha1(input);
};

const createToken = (id, email) => {
    const expired = Math.floor(Date.now() / 1000) + (60 * config.jwtTokenExpired);
    const payload = {
        id,
        email
    };

    return jwtWebToken.sign({ payload, exp: expired }, config.jwtSecretKey);
};

const insertUserAction = (request, response, payload, callback) => {
    connectionPool.getConnection((connectionError, connection) => {
        if (connectionError) {
            response.status(500).send(`${stringZh.dbConnectionFailure}: ${connectionError}`);
        } else {
            const sqlString = 'insert into user_actions set ? ';
            const insertData = {
                user_id: payload.id,
                action_url: request.originalUrl
            };

            connection.query(sqlString, insertData, callback);
        }
    });
};

const getEmailVerifiedCallback = (request, response, next, payload) => {
    return (error, result) => {
        if (error) {
            response.status(500).send(`${stringZh.emailVerifiedError}: ${error}`);
        } else if (result.length === 1 && result[0].sign_up_type === SIGN_UP_BY_EMAIL && result[0].has_verified === 0) {
            response.status(423).send(`${stringZh.emailVerifiedNotYet}`);
        } else {
            insertUserAction(request, response, payload, (err) => {
                if (err) {
                    response.status(500).send(`${stringZh.insertUserActionFailure}: ${error}`);
                } else {
                    next();
                }
            });
        }
    };
};

const isUserEmailVerified = (request, response, next, payload) => {
    connectionPool.getConnection((connectionError, connection) => {
        if (connectionError) {
            response.status(500).send(`${stringZh.dbConnectionFailure}: ${connectionError}`);
        } else {
            const sqlString = 'select * from users where id = ? ';

            connection.query(sqlString, payload.id, getEmailVerifiedCallback(request, response, next, payload));
        }
    });
};

const getTokenVerifier = (need2CheckEmailVerified) => {
    return (request, response, next) => {
        const bearerHeader = request.headers.authorization;

        console.log('Request', JSON.stringify(request));
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];

            jwtWebToken.verify(token, config.jwtSecretKey, (error, decoded) => {
                if (error) {
                    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;

                    response.status(statusCode).send(`${stringZh.invalidToken}: ${error}`);
                } else if (need2CheckEmailVerified) {
                    isUserEmailVerified(request, response, next, decoded.payload);
                } else {
                    next();
                }
            });
        } else {
            response.status(403).send(`${stringZh.invalidToken}`);
        }
    };
};

const getTokenExpiredVerifier = () => {
    return (request, response, next) => {
        const bearerHeader = request.headers.authorization;

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];

            jwtWebToken.verify(token, config.jwtSecretKey, (error) => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        next();
                    } else {
                        response.status(403).send(`${stringZh.invalidToken}: ${error}`);
                    }
                } else {
                    response.status(405).send(stringZh.tokenNotExpiredYet);
                }
            });
        } else {
            response.status(405).send(stringZh.invalidToken);
        }
    };
};

const getTokenVerifierCheckEmail = () => {
    return getTokenVerifier(true);
};

const getTokenVerifierDontCheckEmail = () => {
    return getTokenVerifier(false);
};

const jwt = {
    createToken,
    getHash,
    getTokenVerifierCheckEmail,
    getTokenVerifierDontCheckEmail,
    getTokenExpiredVerifier
};

const toLocalTime = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

const common = {
    toLocalTime
};

export default {
	sql,
    http,
    jwt,
    common
};
