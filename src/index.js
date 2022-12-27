import https from 'https';
import fs from 'fs';
import config from './config/config';
import app from './config/express';

const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = {
    key: privateKey,
    cert: certificate
};

// if (!module.parent) {
//     app.listen(config.port, () => {
//         console.log(`server started on  port https://127.0.0.1:${config.port} (${config.env})`);
//     });
// }

https.createServer(credentials, app).listen(config.port, () => {
    console.log('https server listening on port 3000');
});

export default app;

