
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import userRouter from './src/interface/routes/user';
import adminRouter from './src/interface/routes/admin';
import dbConnection from './src/adapters/database';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const app = express();
dotenv.config({ path: path.resolve(__dirname, '.env') });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.json());

app.use('/', userRouter)
app.use('/admin', adminRouter)
dbConnection()
app.listen(3000, () => {
    console.log('Server Running....')
})