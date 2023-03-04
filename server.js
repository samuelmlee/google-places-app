import express from 'express';
import proxy from 'express-http-proxy';

const app = express();
app.use('/google', proxy('https://maps.googleapis.com'));

app.use(express.static('dist/google-places-app'));

app.listen(4200);
