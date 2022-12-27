import express from 'express';
import parametersValidation from '../../config/parameters_validation';
import utility from '../utility';
import loginController from '../controllers/login_controller';
import stringZh from '../../config/string_zh';

const router = express.Router();
const tokenVerifier = utility.jwt.getTokenVerifierCheckEmail();
const tokenExpiredVerifier = utility.jwt.getTokenExpiredVerifier();
const postErrorMessage = `${stringZh.inputFormatError}: ${stringZh.passwordFormat}`;
const postValidator = utility.http.getValidationMiddleware(parametersValidation.signUp, postErrorMessage);
const resetPasswordValidator = utility.http.getValidationMiddleware(parametersValidation.resetPassword, postErrorMessage);
const refreshTokenValidator = utility.http.getValidationMiddleware(parametersValidation.refreshToken, stringZh.inputFormatError);
const googleOrFacebookLoginValidator = utility.http.getValidationMiddleware(parametersValidation.googleOrFacebookLogin, stringZh.inputFormatError);

router.route('/').post(postValidator, loginController.post);
router.route('/:id').put([tokenVerifier, resetPasswordValidator], loginController.put);
router.route('/refreshtoken').post([tokenExpiredVerifier, refreshTokenValidator], loginController.refreshToken);

router.route('/google').post(googleOrFacebookLoginValidator, loginController.googleLogin);
router.route('/facebook').post(googleOrFacebookLoginValidator, loginController.facebookLogin);

export default router;
