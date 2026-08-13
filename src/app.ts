import express, { type Express } from 'express';
import userRouter from './routes/userRoutes';
import config from './config';

const app: Express = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.use('/users', userRouter);

app.use('/static', express.static('public'));

if (config.NODE_ENV !== 'test') {
  const PORT = config.PORT;
  app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
}

export default app;