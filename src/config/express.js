import express from 'express';
// import httpStatus from 'http-status';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import morgan from 'morgan';
import index from '../server/routes/index_route';
// import config from './config';

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'jade');
app.get('/', (request, response) => {
    response.render('index', { serverHost: request.headers.host });
});
app.use('/api', index);
app.get('/auth/facebook', passport.authenticate('facebook'));

export default app;
