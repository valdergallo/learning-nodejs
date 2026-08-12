import express, { type Express } from 'express';
import userRouter from './routes/userRoutes';

const app: Express = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRouter);

app.use('/static', express.static('public'));

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));