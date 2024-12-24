// import express from 'express';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import authRouter from "./routes/authRoutes.js";
// import videoRoutes from './routes/video.routes.js'
// dotenv.config();

// const app = express();
// mongoose.connect(process.env.MONGODB_URL);
// app.use(cors({
//   origin: [process.env.FRONTEND_URL],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));


// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use('/auth', authRouter);
// app.use('/video', videoRoutes)

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// const PORT = 5001;
// app.listen(PORT, () => {
//   console.log(`Server started on port ${PORT}`);
// });


import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';

const app = express();
app.use(express.json())
app.use(cors({
  origin: ['https://solestyle.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));


app.use(express.static('public'))
app.use(cookieParser())

mongoose.connect('mongodb+srv://muhammadbilal94390:bilalkhan94390@cluster0.ibfi1yh.mongodb.net/testEcom?retryWrites=true&w=majority&appName=Cluster0');
app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.listen(3001, () => {
  console.log("Server is Running")
})




