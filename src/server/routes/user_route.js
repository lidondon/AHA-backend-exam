import express from 'express';
import parametersValidation from '../../config/parameters_validation';
import utility from '../utility';
import userController from '../controllers/user_controller';
import stringZh from '../../config/string_zh';

const router = express.Router();
const tokenVerifier = utility.jwt.getTokenVerifierCheckEmail();
const tokenVerifierDontCheckEmail = utility.jwt.getTokenVerifierDontCheckEmail();
const postErrorMessage = `${stringZh.inputFormatError}: ${stringZh.passwordFormat}`;
const postValidator = utility.http.getValidationMiddleware(parametersValidation.signUp, postErrorMessage);
const putValidator = utility.http.getValidationMiddleware(parametersValidation.resetName, stringZh.inputFormatError);
const sendEmailValidator = utility.http.getValidationMiddleware(parametersValidation.sendEmail, stringZh.inputFormatError);

router.route('/')
    .post(postValidator, userController.post);

router.route('/:id')
    .get(tokenVerifier, userController.get)
    .put([tokenVerifier, putValidator], userController.put);

router.route('/sendemail')
    .post([tokenVerifierDontCheckEmail, sendEmailValidator], userController.sendVerifyingEmail);

router.route('/verify/:id/hash/:emailhash').get(userController.verifyEmail);

export default router;
