import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./infrastructure/database/mongo";
import adminRoutes from "./presentation/express/AdminRoutes";
import AuthRouter from './presentation/express/AuthRoutes';
import passport from "./infrastructure/security/googleStrategy";
import MainRouter from './presentation/express/MainAdminRoute'
import cors from 'cors'


const app = express();

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true                
}));
app.use(express.json());
app.use(passport.initialize());

app.use("/admin", adminRoutes);
app.use('/auth',AuthRouter)
app.use('/superadmin',MainRouter)

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(` Server running on port ${process.env.PORT || 5000}`);
  });
});