import express from 'express';
import morgan from 'morgan';
import authRouter from './routes/auth.routes.js';
import groupRouter from './routes/group.routes.js';
import expenseRouter from './routes/expense.route.js';
import settlementRouter from './routes/settlement.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/group',groupRouter);
app.use('/api/expense',expenseRouter);
app.use('/api/settlement',settlementRouter);
app.use('/api/user',userRouter);

export default app;