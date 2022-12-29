module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_sha1__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_js_sha1___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_js_sha1__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_http_status__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_http_status___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_http_status__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mysql__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_mysql___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_mysql__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_string_zh__ = __webpack_require__(1);







const SIGN_UP_BY_EMAIL = 1;

// sql utility

const connectionPool = __WEBPACK_IMPORTED_MODULE_3_mysql___default.a.createPool({
    connectionLimit: 20,
    host: __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].mysqlHost,
    user: __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].mysqlUserName,
    password: __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].mysqlPass,
    database: __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].mysqlDatabase,
    timezone: 'UTC',
    multipleStatements: true
});

const sql = {
    connectionPool
};

// http utility

const successResponse = data => {
    return {
        statusCode: __WEBPACK_IMPORTED_MODULE_2_http_status___default.a[200],
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

const getHash = input => {
    return __WEBPACK_IMPORTED_MODULE_1_js_sha1___default()(input);
};

const createToken = (id, email) => {
    const expired = Math.floor(Date.now() / 1000) + 60 * __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].jwtTokenExpired;
    const payload = {
        id,
        email
    };

    return __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default.a.sign({ payload, exp: expired }, __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].jwtSecretKey);
};

const insertUserAction = (request, response, payload, callback) => {
    connectionPool.getConnection((connectionError, connection) => {
        if (connectionError) {
            response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].dbConnectionFailure}: ${connectionError}`);
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
            response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].emailVerifiedError}: ${error}`);
        } else if (result.length === 1 && result[0].sign_up_type === SIGN_UP_BY_EMAIL && result[0].has_verified === 0) {
            response.status(423).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].emailVerifiedNotYet}`);
        } else {
            insertUserAction(request, response, payload, err => {
                if (err) {
                    response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].insertUserActionFailure}: ${error}`);
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
            response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].dbConnectionFailure}: ${connectionError}`);
        } else {
            const sqlString = 'select * from users where id = ? ';

            connection.query(sqlString, payload.id, getEmailVerifiedCallback(request, response, next, payload));
        }
    });
};

const getTokenVerifier = need2CheckEmailVerified => {
    return (request, response, next) => {
        const bearerHeader = request.headers.authorization;

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];

            __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default.a.verify(token, __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].jwtSecretKey, (error, decoded) => {
                if (error) {
                    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;

                    response.status(statusCode).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].invalidToken}: ${error}`);
                } else if (need2CheckEmailVerified) {
                    isUserEmailVerified(request, response, next, decoded.payload);
                } else {
                    next();
                }
            });
        } else {
            response.status(403).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].invalidToken}`);
        }
    };
};

const getTokenExpiredVerifier = () => {
    return (request, response, next) => {
        const bearerHeader = request.headers.authorization;

        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            const token = bearer[1];

            __WEBPACK_IMPORTED_MODULE_0_jsonwebtoken___default.a.verify(token, __WEBPACK_IMPORTED_MODULE_4__config_config__["a" /* default */].jwtSecretKey, error => {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        next();
                    } else {
                        response.status(403).send(`${__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].invalidToken}: ${error}`);
                    }
                } else {
                    response.status(405).send(__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].tokenNotExpiredYet);
                }
            });
        } else {
            response.status(405).send(__WEBPACK_IMPORTED_MODULE_5__config_string_zh__["a" /* default */].invalidToken);
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

const toLocalTime = timestamp => {
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

/* harmony default export */ __webpack_exports__["a"] = ({
    sql,
    http,
    jwt,
    common
});

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
    dbConnectionFailure: '資料庫連線失敗！',
    insertFailure: '新增失敗！',
    inputFormatError: '輸入格式有誤，請重新確認！',
    loginError: '帳號、密碼錯誤，請重新輸入！',
    passwordError: '密碼錯誤，請重新輸入！',
    loginRecordFailure: '登入記錄發生錯誤！',
    updateUserFailure: '帳號資料修改失敗！',
    invalidToken: '不合法的token！',
    forbidden: '無訪問權限！',
    noUser: '無此會員資料！',
    insertUserActionFailure: '記錄用戶行為發生錯誤！',
    getUserFailure: '取用戶資料發生錯誤！',
    getUsersFailure: '取所有用戶資料發生錯誤！',
    getDataFailure: '取資料發生錯誤！',
    emailVerifiedNotYet: '請先通過email驗證！',
    emailVerifiedError: '過email驗證發生錯誤！',
    refreshTokenFailure: 'refresh token失敗！',
    tokenNotExpiredYet: 'token尚未過期！',
    verifyingEmailSubject: 'AHA後端Email驗證',
    clickUrlBelow2Verify: '請點擊下方連結完成Email驗證',
    verifyingEmailLinkError: 'Email認證連結錯誤',
    noGoogleUser: '並未取得Google用戶資料！',
    duplicatedEmail: '此Email已經註冊過！',
    passwordFormat: '密碼至少需要一個小寫字母、一個大小字母、一個數字、一個特殊符號以及長度超過八！'
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_joi__);


// require and configure dotenv, will load vars in .env in PROCESS.ENV
__webpack_require__(10).config();

// 建立每個變數 joi 驗證規則
const envVarSchema = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    VERSION: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    NODE_ENV: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().default('development').allow(['development', 'production']),
    PORT: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.number().default(3000),
    MYSQL_PORT: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.number().default(3306),
    MYSQL_HOST: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().default('127.0.0.1'),
    MYSQL_USER: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    MYSQL_PASS: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    MYSQL_NAME: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    JWT_SECRET_KEY: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    JWT_EXPIRED: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.number().default(20),
    SENDGRID_API_KEY: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    EMAIL_FROM: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email(),
    GOOGLE_CLIENT_ID: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    GOOGLE_CLIENT_SECRET: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    FACEBOOK_CLIENT_ID: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string(),
    FACEBOOK_CLIENT_SECRET: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string()
}).unknown().required();

const { error, value: envVars } = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.validate(process.env, envVarSchema);

if (error) throw new Error(`Config validation error: ${error.message}`);

const config = {
    version: envVars.VERSION,
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    mysqlPort: envVars.MYSQL_PORT,
    mysqlHost: envVars.MYSQL_HOST,
    mysqlUserName: envVars.MYSQL_USER,
    mysqlPass: envVars.MYSQL_PASS,
    mysqlDatabase: envVars.MYSQL_DATABASE,
    jwtSecretKey: envVars.JWT_SECRET_KEY,
    jwtTokenExpired: envVars.JWT_EXPIRED,
    sendgridApiKey: envVars.SENDGRID_API_KEY,
    emailFrom: envVars.EMAIL_FROM,
    googleClientId: envVars.GOOGLE_CLIENT_ID,
    googleClientSecret: envVars.GOOGLE_CLIENT_SECRET,
    facebookClientId: envVars.FACEBOOK_CLIENT_ID,
    facebookClientSecret: envVars.FACEBOOK_CLIENT_SECRET
};

/* harmony default export */ __webpack_exports__["a"] = (config);

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_joi___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_joi__);


const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

const refreshToken = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    id: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.number().integer().required(),
    email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required()
});

const signUp = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required(),
    password: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().regex(passwordRegEx).required()
});

const googleOrFacebookLogin = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required(),
    name: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string()
});

const resetName = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    name: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().required()
});

const resetPassword = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    password: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().regex(passwordRegEx).required(),
    newPassword: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().regex(passwordRegEx).required()
});

const sendEmail = __WEBPACK_IMPORTED_MODULE_0_joi___default.a.object().keys({
    id: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.number().required(),
    email: __WEBPACK_IMPORTED_MODULE_0_joi___default.a.string().email().required()
});

/* harmony default export */ __webpack_exports__["a"] = ({
    refreshToken,
    signUp,
    googleOrFacebookLogin,
    resetName,
    resetPassword,
    sendEmail
});

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sendgrid_mail__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sendgrid_mail___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__sendgrid_mail__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_string_zh__ = __webpack_require__(1);
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };






const getUser = id => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
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

const getUserByEmail = email => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where email = ? ';

                connection.query(sqlString, email, (error, result) => {
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

const createUser = newUser => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'insert into users set ? ';
                const insertData = _extends({}, newUser, {
                    password: __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].jwt.getHash(newUser.password)
                });

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
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
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
            from: __WEBPACK_IMPORTED_MODULE_2__config_config__["a" /* default */].emailFrom,
            subject: __WEBPACK_IMPORTED_MODULE_3__config_string_zh__["a" /* default */].verifyingEmailSubject,
            html: `<b>${__WEBPACK_IMPORTED_MODULE_3__config_string_zh__["a" /* default */].clickUrlBelow2Verify}</b><br />${url}/${user.id}/hash/${__WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].jwt.getHash(user.email)}`
        };

        __WEBPACK_IMPORTED_MODULE_0__sendgrid_mail___default.a.setApiKey(__WEBPACK_IMPORTED_MODULE_2__config_config__["a" /* default */].sendgridApiKey);
        __WEBPACK_IMPORTED_MODULE_0__sendgrid_mail___default.a.send(message, (error, json) => {
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
        getUser(id).then(users => {
            if (users.length === 1 && emailhash === __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].jwt.getHash(users[0].email)) {
                updateUser({ has_verified: 1 }, id).then(result => {
                    resolve(result);
                }).catch(updateError => {
                    reject(updateError);
                });
            } else {
                reject(__WEBPACK_IMPORTED_MODULE_3__config_string_zh__["a" /* default */].verifyingEmailLinkError);
            }
        }).catch(error => {
            reject(error);
        });
    });
};

/* harmony default export */ __webpack_exports__["a"] = ({
    getUser,
    getUserByEmail,
    createUser,
    updateUser,
    sendVerifyingEmail,
    verifyEmail
});

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_https__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_https___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_https__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_config__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__config_express__ = __webpack_require__(11);





const privateKey = __WEBPACK_IMPORTED_MODULE_1_fs___default.a.readFileSync('key.pem', 'utf8');
const certificate = __WEBPACK_IMPORTED_MODULE_1_fs___default.a.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};

// if (!module.parent) {
//     app.listen(config.port, () => {
//         console.log(`server started on  port https://127.0.0.1:${config.port} (${config.env})`);
//     });
// }

__WEBPACK_IMPORTED_MODULE_0_https___default.a.createServer(credentials, __WEBPACK_IMPORTED_MODULE_3__config_express__["a" /* default */]).listen(__WEBPACK_IMPORTED_MODULE_2__config_config__["a" /* default */].port, () => {
    console.log('https server listening on port 3000');
});

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_3__config_express__["a" /* default */]);

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("https");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_parser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cors__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_cors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_cors__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_morgan__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_morgan___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_morgan__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__server_routes_index_route__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config__ = __webpack_require__(3);







const app = __WEBPACK_IMPORTED_MODULE_0_express___default()();

app.use(__WEBPACK_IMPORTED_MODULE_2_cors___default()());
app.use(__WEBPACK_IMPORTED_MODULE_1_body_parser___default.a.json());
app.use(__WEBPACK_IMPORTED_MODULE_1_body_parser___default.a.urlencoded({ extended: true }));
app.use(__WEBPACK_IMPORTED_MODULE_3_morgan___default()('dev'));
app.use(__WEBPACK_IMPORTED_MODULE_0_express___default.a.static('public'));
app.set('view engine', 'jade');

app.get('/', (request, response) => {
    response.render('index', {
        serverHost: request.headers.host,
        googleClientId: __WEBPACK_IMPORTED_MODULE_5__config__["a" /* default */].googleClientId,
        facebookClientId: __WEBPACK_IMPORTED_MODULE_5__config__["a" /* default */].facebookClientId
    });
});
app.use('/api', __WEBPACK_IMPORTED_MODULE_4__server_routes_index_route__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (app);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("cors");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__login_route__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_route__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__statistics_route__ = __webpack_require__(26);





const router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();

router.use('/user', __WEBPACK_IMPORTED_MODULE_2__user_route__["a" /* default */]);
router.use('/login', __WEBPACK_IMPORTED_MODULE_1__login_route__["a" /* default */]);
router.use('/statistics', __WEBPACK_IMPORTED_MODULE_3__statistics_route__["a" /* default */]);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_string_zh__ = __webpack_require__(1);






const router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();
const tokenVerifier = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].jwt.getTokenVerifierCheckEmail();
const tokenExpiredVerifier = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].jwt.getTokenExpiredVerifier();
const postErrorMessage = `${__WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError}: ${__WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].passwordFormat}`;
const postValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].signUp, postErrorMessage);
const resetPasswordValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].resetPassword, postErrorMessage);
const refreshTokenValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].refreshToken, __WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError);
const googleOrFacebookLoginValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].googleOrFacebookLogin, __WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError);

router.route('/').post(postValidator, __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].post);
router.route('/:id').put([tokenVerifier, resetPasswordValidator], __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].put);
router.route('/refreshtoken').post([tokenExpiredVerifier, refreshTokenValidator], __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].refreshToken);

router.route('/google').post(googleOrFacebookLoginValidator, __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].googleLogin);
router.route('/facebook').post(googleOrFacebookLoginValidator, __WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].facebookLogin);
router.route('/privacy').get(__WEBPACK_IMPORTED_MODULE_3__controllers_login_controller__["a" /* default */].privacy);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("js-sha1");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("http-status");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_login_module__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_string_zh__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(0);





const refreshToken = (request, response) => {
    const input = request.body;

    __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].refreshToken(input).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(error);
    });
};

const post = (request, response) => {
    const input = request.body;

    __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].login(input).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(error);
    });
};

const put = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].resetPassword(request.body, request.params).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result.affectedRows === 1));
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].updateUserFailure}: ${error}`);
    });
};

const googleLogin = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].googleOrFacebookLogin(request.body.email, request.body.name, __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].SIGN_UP_TYPE.GOOGLE).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(`Google login error: ${error}`);
    });
};

const facebookLogin = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].googleOrFacebookLogin(request.body.email, request.body.name, __WEBPACK_IMPORTED_MODULE_0__modules_login_module__["a" /* default */].SIGN_UP_TYPE.FACEBOOK).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(`Facebook login error: ${error}`);
    });
};

const privacy = (request, response) => {
    response.send('隱私權保護政策內容，包括本網站如何處理在您使用網站服務時收集到的個人識別資料。隱私權保護政策不適用於本網站以外的相關連結網站，也不適用於非本網站所委託或參與管理的人員。');
};

/* harmony default export */ __webpack_exports__["a"] = ({
    refreshToken,
    post,
    put,
    googleLogin,
    facebookLogin,
    privacy
});

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_module__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config_string_zh__ = __webpack_require__(1);




const SIGN_UP_TYPE = {
    EMAIL: 1,
    FACEBOOK: 2,
    GOOGLE: 3
};

// for saving time, use this simple way not "access token and refresh token" and might have some safety issue
const refreshToken = input => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where id = ? and email = ?';
                const sqlParameters = [input.id, input.email];

                connection.query(sqlString, sqlParameters, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(__WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].refreshTokenFailure);
                    } else {
                        resolve({ token: __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].jwt.createToken(result[0].id, result[0].email) });
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

const login = loginData => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                const sqlString = 'select * from users where email = ? and password = ?';
                const sqlParameters = [loginData.email, __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].jwt.getHash(loginData.password)];

                connection.query(sqlString, sqlParameters, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(__WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].loginError);
                    } else {
                        const data = {
                            id: result[0].id,
                            email: result[0].email,
                            name: result[0].name,
                            hasVerified: result[0].has_verified,
                            token: __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].jwt.createToken(result[0].id, result[0].email)
                        };

                        insertLoginRecord(result[0].id, connection, err => {
                            if (err) {
                                reject(__WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].loginRecordFailure);
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

const googleOrFacebookLogin = (email, name, signUptype) => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_1__user_module__["a" /* default */].getUserByEmail(email).then(result => {
            const user = {
                email,
                name,
                password: email
            };

            if (result.length === 1) {
                user.id = result[0].id;
                login(user).then(data => {
                    resolve(data);
                }).catch(error => {
                    if (error === __WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].loginError) {
                        reject(__WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].duplicatedEmail);
                    }
                });
            } else {
                user.sign_up_type = signUptype;
                user.has_verified = 1;
                __WEBPACK_IMPORTED_MODULE_1__user_module__["a" /* default */].createUser(user).then(id => {
                    user.id = id;
                    login(user).then(data => {
                        resolve(data);
                    });
                });
            }
        });
    });
};

const verifyPassword = (id, password, connection, callback) => {
    const sqlString = 'select * from users where id = ? and password = ?';
    const sqlParameters = [id, __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].jwt.getHash(password)];

    connection.query(sqlString, sqlParameters, callback);
};

const resetPassword = (input, params) => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
            if (connectionError) {
                reject(connectionError);
            } else {
                verifyPassword(params.id, input.password, connection, (error, result) => {
                    if (error) {
                        reject(error.sqlMessage);
                    } else if (result.length === 0) {
                        reject(__WEBPACK_IMPORTED_MODULE_2__config_string_zh__["a" /* default */].passwordError);
                    } else {
                        const sqlString = 'update users set password = ? where id = ?';
                        const newPasswordHash = __WEBPACK_IMPORTED_MODULE_0__utility__["a" /* default */].jwt.getHash(input.newPassword);
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

/* harmony default export */ __webpack_exports__["a"] = ({
    SIGN_UP_TYPE,
    refreshToken,
    login,
    googleOrFacebookLogin,
    resetPassword
});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = require("@sendgrid/mail");

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__config_string_zh__ = __webpack_require__(1);






const router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();
const tokenVerifier = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].jwt.getTokenVerifierCheckEmail();
const tokenVerifierDontCheckEmail = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].jwt.getTokenVerifierDontCheckEmail();
const postErrorMessage = `${__WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError}: ${__WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].passwordFormat}`;
const postValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].signUp, postErrorMessage);
const putValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].resetName, __WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError);
const sendEmailValidator = __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.getValidationMiddleware(__WEBPACK_IMPORTED_MODULE_1__config_parameters_validation__["a" /* default */].sendEmail, __WEBPACK_IMPORTED_MODULE_4__config_string_zh__["a" /* default */].inputFormatError);

router.route('/').post(postValidator, __WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__["a" /* default */].post);

router.route('/:id').get(tokenVerifier, __WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__["a" /* default */].get).put([tokenVerifier, putValidator], __WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__["a" /* default */].put);

router.route('/sendemail').post([tokenVerifierDontCheckEmail, sendEmailValidator], __WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__["a" /* default */].sendVerifyingEmail);

router.route('/verify/:id/hash/:emailhash').get(__WEBPACK_IMPORTED_MODULE_3__controllers_user_controller__["a" /* default */].verifyEmail);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_user_module__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_string_zh__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(0);




const get = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_user_module__["a" /* default */].getUser(request.params.id).then(result => {
        if (result.length === 1) {
            const user = {
                id: result[0].id,
                email: result[0].email,
                name: result[0].name,
                hasVerified: result[0].has_verified,
                signUpType: result[0].sign_up_type,
                createdTime: result[0].created_time
            };

            response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(user));
        } else {
            response.status(204).send(__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].noUser);
        }
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].getUserFailure}: ${error}`);
    });
};

const post = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_user_module__["a" /* default */].createUser(request.body).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse({ id: result }));
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].insertFailure}: ${error}`);
    });
};

const put = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_user_module__["a" /* default */].updateUser(request.body, request.params.id).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result.affectedRows === 1));
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].updateUserFailure}: ${error}`);
    });
};

const sendVerifyingEmail = (request, response) => {
    const url = `https://${request.headers.host}/api/user/verify`;

    __WEBPACK_IMPORTED_MODULE_0__modules_user_module__["a" /* default */].sendVerifyingEmail(url, request.body).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(error);
    });
};

const verifyEmail = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_user_module__["a" /* default */].verifyEmail(request.params.id, request.params.emailhash).then(() => {
        response.redirect('/');
    }).catch(error => {
        response.status(500).send(error);
    });
};

/* harmony default export */ __webpack_exports__["a"] = ({
    get,
    post,
    put,
    sendVerifyingEmail,
    verifyEmail
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_statistics_controller__ = __webpack_require__(27);




const router = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();
const tokenVerifier = __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].jwt.getTokenVerifierCheckEmail();

router.route('/getusers').get(tokenVerifier, __WEBPACK_IMPORTED_MODULE_2__controllers_statistics_controller__["a" /* default */].getUsers);
router.route('/getuserstatistics').get(tokenVerifier, __WEBPACK_IMPORTED_MODULE_2__controllers_statistics_controller__["a" /* default */].getUserStatistics);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_statistics_module__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_string_zh__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utility__ = __webpack_require__(0);




const getUsers = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_statistics_module__["a" /* default */].getUsers(request.body).then(result => {
        const data = result.map(r => {
            return {
                id: r.id,
                email: r.email,
                name: r.name,
                createdTime: __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].common.toLocalTime(r.created_time),
                loginTimes: r.login_times,
                theLastActionTime: __WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].common.toLocalTime(r.action_time),
                action: r.action_url
            };
        });

        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(data));
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].getUsersFailure}: ${error}`);
    });
};

const getUserStatistics = (request, response) => {
    __WEBPACK_IMPORTED_MODULE_0__modules_statistics_module__["a" /* default */].getUserStatistics(request.body).then(result => {
        response.send(__WEBPACK_IMPORTED_MODULE_2__utility__["a" /* default */].http.successResponse(result));
    }).catch(error => {
        response.status(500).send(`${__WEBPACK_IMPORTED_MODULE_1__config_string_zh__["a" /* default */].getUsersFailure}: ${error}`);
    });
};

/* harmony default export */ __webpack_exports__["a"] = ({
    getUsers,
    getUserStatistics
});

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__config_string_zh__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utility__ = __webpack_require__(0);



const getUsers = () => {
    return new Promise((resolve, reject) => {
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
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

const checkUsersStatistics = data => {
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
        __WEBPACK_IMPORTED_MODULE_1__utility__["a" /* default */].sql.connectionPool.getConnection((connectionError, connection) => {
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
                            reject(__WEBPACK_IMPORTED_MODULE_0__config_string_zh__["a" /* default */].getDataFailure);
                        } else {
                            const sum = result[2].reduce((partialSum, data) => {
                                return partialSum + data.active_user_count;
                            }, 0);
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

/* harmony default export */ __webpack_exports__["a"] = ({
    getUsers,
    getUserStatistics
});

/***/ })
/******/ ]);