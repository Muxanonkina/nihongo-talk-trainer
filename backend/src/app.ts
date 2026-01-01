import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';

const app: Express = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('dev'));

// Routes
import authRoutes from './modules/auth/auth.routes';

app.use('/api/auth', authRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Nihongo Talk Trainer API is running 🚀');
});

export default app;
