import https from 'https';
import fs from 'fs';
// import config from './config/config';
import app from './config/express';

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};

https.createServer(credentials, app).listen(3000, () => {
    console.log('https server listening on port 3000');
});

export default app;

