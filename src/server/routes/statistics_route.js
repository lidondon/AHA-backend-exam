import express from 'express';
import utility from '../utility';
import statisticsController from '../controllers/statistics_controller';

const router = express.Router();
const tokenVerifier = utility.jwt.getTokenVerifierCheckEmail();

router.route('/getusers').get(tokenVerifier, statisticsController.getUsers);
router.route('/getuserstatistics').get(tokenVerifier, statisticsController.getUserStatistics);

export default router;
