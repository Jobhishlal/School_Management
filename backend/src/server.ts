import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./infrastructure/config/mongo";
import adminRoutes from "./presentation/express/AdminRoutes";
import adminComplaintRoutes from "./presentation/express/AdminComplaintRoutes";
import AuthRouter from './presentation/express/AuthRoutes';
import passport from "./infrastructure/security/googleStrategy";
import MainRouter from './presentation/express/MainAdminRoute';
import Studentrouter from './presentation/express/StudentRoute';
import Teacherrouter from './presentation/express/TeacherRoutes';
import ParentRouter from './presentation/express/ParentRooute';
import Leaverouter from './presentation/express/LeaveRoutes';
import MeetingRouter from './presentation/express/MeetingRoutes';
import studentAIRouter from './presentation/express/StudentAIRoutes';
import cors from 'cors'
import { startFeeExpiryCron } from './infrastructure/cron/FeeExpiryCron';
import http from 'http';

import { initSocket } from './infrastructure/socket/socket';

const app = express();

// @ts-ignore
import cookieParser from 'cookie-parser';

const allowedOrigins = [
  'https://brainnots.ddns.net',
  'http://brainnots.ddns.net',
  'http://13.54.178.155',
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);


app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/admin", adminRoutes);
app.use('/auth', AuthRouter)
app.use('/superadmin', MainRouter)
app.use('/student', Studentrouter)
app.use('/teacher', Teacherrouter);
app.use('/teacher', Leaverouter);
app.use('/parents', ParentRouter);
app.use('/meeting', MeetingRouter);
app.use('/student/ai', studentAIRouter);
import ChatRouter from './presentation/express/ChatRoutes';

app.use('/admin', adminComplaintRoutes);
app.use('/chat', ChatRouter);


export const httpServer = http.createServer(app);
connectDB().then(() => {
  startFeeExpiryCron()
  initSocket(httpServer)
  httpServer.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
});