// dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import MethodOverride from 'method-override';
const app = express();

//files
import { errorHandler } from './middlewares/errorHandler.middleware';
import homeRoutes from './routes/home.routes';
import authRouter from './routes/auth.routes';
import userRouter from './routes/users.routes';



//express middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');	
app.use(cookieParser());
app.set('views', path.join(__dirname, '../src/views'));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(MethodOverride('_method'));



// routes
app.use('/', homeRoutes);
app.use('/auth', authRouter);
app.use('/users', userRouter);

//use errorHandler middleware
app.use(errorHandler);

export default app;