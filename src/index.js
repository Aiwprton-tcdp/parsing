// import express, { Express, Request, Response } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import KHLRoute from './routes/khl.js';

dotenv.config();
// const app: Express = express();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(function (err: any, req: Request, res: Response, next: any) {
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
app.use('/khl', KHLRoute);

// app.get('/', (req: Request, res: Response) => {
app.get('/', (req, res) => {
  res.send('Парсинг для Антона<br/><br/><a href="/khl/schedule">Tornaments</a>');
});

app.listen(port, () => {
  console.log(`Listening to port http://localhost:${port}`);
});
