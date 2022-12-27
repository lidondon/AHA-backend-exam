import Joi from 'joi';

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// 建立每個變數 joi 驗證規則
const envVarSchema = Joi.object().keys({
    VERSION: Joi.string(),
    NODE_ENV: Joi.string().default('development').allow(['development', 'production']),
    PORT: Joi.number().default(3000),
    MYSQL_PORT: Joi.number().default(3306),
    MYSQL_HOST: Joi.string().default('127.0.0.1'),
    MYSQL_USER: Joi.string(),
    MYSQL_PASS: Joi.string(),
    MYSQL_NAME: Joi.string(),
    JWT_SECRET_KEY: Joi.string(),
    JWT_EXPIRED: Joi.number().default(20),
    SENDGRID_API_KEY: Joi.string(),
    EMAIL_FROM: Joi.string().email(),
    GOOGLE_CLIENT_ID: Joi.string(),
    GOOGLE_CLIENT_SECRET: Joi.string(),
    FACEBOOK_CLIENT_ID: Joi.string(),
    FACEBOOK_CLIENT_SECRET: Joi.string()
}).unknown().required();

const { error, value: envVars } = Joi.validate(process.env, envVarSchema);

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

export default config;
