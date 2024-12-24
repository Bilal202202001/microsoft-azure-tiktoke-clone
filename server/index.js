import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRouter from "./routes/authRoutes.js";
import videoRoutes from './routes/video.routes.js'
dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODB_URL);
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(cookieParser());
app.use(bodyParser.json());
app.use('/auth', authRouter);
app.use('/video', videoRoutes)


const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});


