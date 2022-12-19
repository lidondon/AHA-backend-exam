import express from 'express';
import httpStatus from 'http-status';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import index from '../server/routes/index_route';
import config from './config';

const app = express();
process.env.TZ = 'Asia/Taipei';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'jade');
app.get('/', (request, response) => {
    // response.send(indexView(request.headers.host));
    response.render('index', { serverHost: request.headers.host });
});
app.use('/api', index);

app.use((err, req, res, next) => {
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        code: err.code ? err.code : httpStatus[err.status],
        stack: config.env === 'development' ? err.stack : {}
    });
    next();
});

export default app;
