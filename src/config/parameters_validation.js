import Joi from 'joi';

const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

const refreshToken = Joi.object().keys({
    id: Joi.number().integer().required(),
    email: Joi.string().email().required()
});

const signUp = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().regex(passwordRegEx).required()
});

const googleOrFacebookLogin = Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string()
});

const resetName = Joi.object().keys({
    name: Joi.string().required()
});

const resetPassword = Joi.object().keys({
    password: Joi.string().regex(passwordRegEx).required(),
    newPassword: Joi.string().regex(passwordRegEx).required()
});

const sendEmail = Joi.object().keys({
    id: Joi.number().required(),
    email: Joi.string().email().required()
});

export default {
    refreshToken,
    signUp,
    googleOrFacebookLogin,
    resetName,
    resetPassword,
    sendEmail
};
