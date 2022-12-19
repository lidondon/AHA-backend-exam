import express from 'express';
import login from './login_route';
import user from './user_route';
import statistics from './statistics_route';

const router = express.Router();

router.use('/user', user);
router.use('/login', login);
router.use('/statistics', statistics);

export default router;
