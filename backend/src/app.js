import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import groupRouter from './routes/group.routes.js';
import expenseRouter from './routes/expense.route.js';
import settlementRouter from './routes/settlement.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/group',groupRouter);
app.use('/api/expense',expenseRouter);
app.use('/api/settlement',settlementRouter);
app.use('/api/user',userRouter);

export default app;