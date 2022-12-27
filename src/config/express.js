import express from 'express';
// import session from 'express-session';
import bodyParser from 'body-parser';
// import passport from 'passport';
// import googleAuth from 'passport-google-oauth20';
import cors from 'cors';
import morgan from 'morgan';
import index from '../server/routes/index_route';
import config from './config';

const app = express();
// const googleOptions = {
//     clientID: config.googleClientId,
//     clientSecret: config.googleClientSecret,
//     callbackURL: 'https://b433-2001-b011-2005-939e-898-2a5d-1c8d-a37f.ngrok.io/api/login/google/callback',
//     passReqToCallback: true
// };

// const googleVerify = (request, accessToken, refreshToken, profile, done) => {
//     // eslint-disable-next-line no-undef
//     // console.log(`googleVerify -> profile: ${JSON.stringify(profile)}`);
//     return done(null, profile);
// };

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.static('public'));
app.set('view engine', 'jade');
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());

app.get('/', (request, response) => {
    response.render('index', {
        serverHost: request.headers.host,
        googleClientId: config.googleClientId,
        facebookClientId: config.facebookClientId
    });
});
app.use('/api', index);

export default app;
