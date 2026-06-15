import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import groupRouter from "./routes/group.routes.js";
import expenseRouter from "./routes/expense.route.js";
import settlementRouter from "./routes/settlement.routes.js";
import userRouter from "./routes/user.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config/config.js";

const app = express();

// Allow multiple origins
const allowedOrigins = [
  config.FRONTEND_URL,                      // Production URL
  'http://localhost:5173',                  // Local Vite dev server
  'http://localhost:3000',                  // Alternative local port
  'http://frontend:5173',                   // Docker Compose service name
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin); // Debug log
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/group", groupRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/settlement", settlementRouter);
app.use("/api/user", userRouter);
app.use("/api/dashboard", dashboardRouter);

export default app;